# el-kit Table State

`@fizz/el-kit` keeps table logic headless. It should not render Element Plus
components; `@fizz/el-comps` owns rendering.

`useTable` uses one state source per field:

- If the caller passes a writable ref, the returned state points to that ref.
- If the caller passes a plain value, `useTable` creates an internal ref.
- If the caller passes a getter or readonly computed, the returned state is
  readable, but setter functions throw.

Setter functions are the write channel, not a separate mode. They write the
same state source that external consumers observe. `columns` and `data` are
shallow state: replace arrays through setters instead of mutating nested column
objects in place.

The first `useTable` v2 scope is synchronous state only: `columns`, `data`,
`loading`, and `pagination`. Async loading and query form composition belong in
a later `useQueryTable`.

The same single-source rule applies to `useQueryForm`: a writable external
model ref stays connected, a plain model is internally managed, and a
getter/readonly computed model is readable but not writable through setters.
Rules follow the same rule: a writable rules ref stays connected, plain rules
are internally managed, and readonly rules reject `setRules()`. `reset()`
restores an initial snapshot, and `submit()` emits the current model snapshot
without owning any rendering.
