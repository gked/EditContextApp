# Iterators
Behavior of iterator types.

1. Iterators are gap-based (they have positions before the first item in a sequence and after the last).
2. Iterators are bi-directional.  They move using `previous` or `next` methods.
3. Iterators are stateful and mutable.  `previous` and `next` are the mutating methods.
4. Iterators cannot be moved beyond the beginning or end of the sequence.  Attempting to do so with `previous` or `next` methods will return `false`.
5. If the `previous` or `next` method on an iterator return `false` the iterator does not (logically) mutate.
6. Iterators must always have a non-null position object describing the current gap where they are positioned.
7. Positions have `before` and `after` methods that return a type appropriate to the iterator and type of position.  The method names take the form `fooBefore` and `fooAfter`.
8. The `fooBefore` position returns the foo which is before the current position and null if there is no foo before the current position (for example because the position is at the beginning of the sequence).  Similarly, `fooAfter` return the foo after the current position or null.
