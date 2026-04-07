# Fix Midnight Blue Theme Contrast

## Context

User reported that midnight-blue theme (`:root`) has poor contrast - background colors are too similar, making UI hard to read.

## Problem

Current midnight-blue theme:
- `--bg-base: #0B1320` - dark blue-black
- `--bg-surface: #111827` - almost same as bg-base
- `--bg-elevated: #1F2937` - still too similar
- `--border-subtle: #374151` - hard to see

This makes it difficult to distinguish between different UI layers (cards, elevated surfaces, borders).

## Work Objectives

1. Fix midnight-blue theme contrast by lightening surface colors
2. Ensure text remains readable against new backgrounds
3. Keep the dark theme feel (don't go too light)

## Proposed Fix

| Variable | Current | New |
|----------|---------|-----|
| --bg-base | #0B1320 | #0B1320 (keep) |
| --bg-surface | #111827 | #1E293B (slate) |
| --bg-elevated | #1F2937 | #334155 (lighter slate) |
| --bg-card | #111827 | #1E293B |
| --bg-hover | #1F2937 | #334155 |
| --border | #1F2937 | #334155 |
| --border-subtle | #374151 | #475569 |

Keep text colors the same:
- `--text-primary: #E0E7FF` (light indigo - good contrast)
- `--text-secondary: #94A3B8` (slate gray - good)
- `--text-muted: #6B7280` (muted gray - good)

## Verification Strategy

1. Open app with midnight-blue theme
2. Verify sidebar vs main content area are visually distinct
3. Verify cards/elevated elements stand out from background
4. Verify text is readable (not washed out, not too bright)
5. Compare with graphite-lime and mint-light themes for consistency

## TODOs

- [x] 1. Update midnight-blue CSS variables in globals.css
- [x] 2. Verify contrast in browser
- [x] 3. Test all three themes still look good

## Success Criteria

- [x] Midnight-blue sidebar clearly distinct from main area
- [x] Cards have visible borders/distinction from background
- [x] Text readable without eye strain
- [x] No theme looks broken compared to others
