# Revert Annual Row Background

## Context

User wants to remove the background color from annual rows - keep only the left border.

## Change Needed

In `app/globals.css`, line 304, remove:
```
background: var(--indigo-dim);
```

Keep:
```
border-left: 3px solid var(--amber);
```

## TODOs

- [ ] 1. Remove background from .annual-row in globals.css
