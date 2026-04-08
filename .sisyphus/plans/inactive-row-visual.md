# Inactive Row Visual Treatment

## Context

User wants to visually distinguish inactive/annual rows from active rows. Earlier, opacity was used but it made the kebab dropdown less visible, so it was removed.

## Problem Analysis

- Inactive rows (annual/periodic expenses not due in current month) need visual distinction
- Opacity approach failed because it made kebab dropdown hard to see
- Current `.annual-row` has `opacity: 1` which provides NO distinction at all

## Options Considered

| # | Option | Verdict |
|---|--------|---------|
| 1 | Opacity | ❌ Rejected - kebab becomes invisible |
| 2 | Left border accent | ✅ Recommended |
| 3 | Background color shift | ⚠️ Combine with border |
| 4 | Dashed border | ❌ Too noisy |
| 5 | Add clock icon | ❌ Clutters name column |
| 6 | Grayscale text | ❌ Looks broken |
| 7 | Striped background | ❌ Clashes with table |

## Recommended Solution

Add a **left border accent** in amber (matching the "due" badge color theme):

```css
.annual-row {
  border-left: 3px solid var(--amber);
}
```

Optional: Add very subtle background for extra depth:
```css
.annual-row {
  background: var(--indigo-dim);
  border-left: 3px solid var(--amber);
}
```

## Why This Works

1. **Doesn't affect kebab** - border is on the row, not inside content
2. **Uses existing language** - amber = due/inactive (same as due-badge)
3. **Clear but not aggressive** - subtle left edge indicator
4. **No layout conflicts** - table cells handle borders fine

## Work Objectives

1. Add left border accent to `.annual-row` in CSS
2. Optionally add subtle background color
3. Verify kebab menu remains fully visible
4. Test across all three themes

## TODOs

- [x] 1. Add left border to .annual-row in globals.css
- [x] 2. Add subtle background if needed
- [x] 3. Verify kebab remains visible
- [x] 4. Test all three themes

## Success Criteria

- [x] Annual/inactive rows have clear left border indicator
- [x] Kebab dropdown remains fully clickable/visible
- [x] Works in midnight-blue, graphite-lime, mint-light
- [x] No visual regression on active rows
