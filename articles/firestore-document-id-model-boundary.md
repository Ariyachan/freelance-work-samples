# The Firestore document had an ID. The model still rejected it.

*An independent, AI-assisted field note based on [a public Omi contribution](https://github.com/BasedHardware/omi/pull/19046). The tests cited below were run for that contribution in September 2026; this article does not claim a new run or an upstream merge.*

The failure looked contradictory. A Firestore query found the task document, and the snapshot had an ID. Yet the next line, `Task(**task_data)`, raised `ValidationError: Task.id Field required`.

The contradiction was in the boundary between the database and the model. Firestore's `DocumentSnapshot.id` is metadata about the document path. `snapshot.to_dict()` returns the stored fields. If an older task document has no redundant `id` field, the reader can return a perfectly good payload that a Pydantic model with `id: str` cannot construct.

That is a narrow bug, but it is easy to miss with tests that stop at the database function. A test can assert that the reader returned a dictionary and never discover that its caller rejects it.

## Put the model after the reader

For this reader, the intended compatibility rule was: keep an ID explicitly stored in the payload; otherwise use the Firestore document ID. In simplified form, the fix was:

```python
for snapshot in query.stream():
    data = snapshot.to_dict()
    if isinstance(data, dict):
        data.setdefault("id", snapshot.id)
        return data
return None
```

`setdefault` is a policy choice, not a universal Firestore recipe. It preserves the already stored ID, even if it differs from the document path. An application that defines the path as the canonical ID should resolve that conflict differently and should test its migration behavior. The Omi reader's existing contract was to preserve explicit payload IDs.

I tested the contract where it mattered: the production reader's output went into the real `Task` model. Only the database query boundary was mocked. The two cases were a snapshot with no stored `id`, and a snapshot whose payload already contained one. The first needed the fallback; the second needed its original value preserved. The assertions also checked the task action, status, timestamps, and request ID, so success could not come from merely inserting a string into an otherwise invalid object.

The [recorded verification](https://github.com/Ariyachan/omi/actions/runs/36238083810) ran those two cases alongside seven focused tests with the repository's Python and dependency lock: nine passed. A negative control restored the earlier reader: the missing-ID case failed with the expected Pydantic error, while the explicit-ID case still passed. This was a targeted fork-side check, with a mocked query. It did not exercise a Firestore emulator, the full backend suite, or upstream CI.

## The tempting second fix was a different contract

The same pull request also changed task writes from `update()` to `set(..., merge=True)`. That deserves a separate decision. The [Firestore Python API](https://docs.cloud.google.com/python/docs/reference/firestore/latest/google.cloud.firestore_v1.document.DocumentReference) says `update()` normally requires the document to exist. A merge `set()` can create a missing document. If an absent task means stale state or a wrong ID, recreating it could conceal the actual error. If task updates are intended to be upserts, the merge may be correct. The caller and product contract decide, not the attractiveness of a shorter write path.

There was also a review claim that `update({"x": None})` deletes `x` while merge-set stores null. I checked the pinned Firestore SDK's serialization in the recorded run: `None` encoded as null in both operations; deletion used the distinct `DELETE_FIELD` sentinel. The review's proposed difference was not the difference the SDK produced. The real outstanding question was whether creating a missing target was acceptable.

That separation mattered. A broad “make database writes safer” story would have mixed a proven read-side model failure with a product decision about missing documents. The model regression had a failing old version and a passing new one. The upsert behavior needed maintainer sign-off. Treating them as one green check would have overstated what the test proved.

The habit I kept from this fix is simple: when storage returns a valid object that a caller cannot use, test across the actual boundary. Then name every persistence change by the state it changes. “Merge” is an API option; “may recreate a deleted task” is the behavior a reviewer has to approve.
