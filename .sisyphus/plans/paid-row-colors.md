# Midnight Blue Theme - Paid Row Color Implementation

## Context

Update Midnight Blue theme to improve visual distinction between paid and unpaid rows WITHOUT changing the overall elevated/card/modal hierarchy.

## Important Constraints

**KEEP THESE TOKENS AS-IS:**
- `--bg-base`: #0B1320
- `--bg-surface`: #1E293B
- `--bg-elevated`: #334155
- `--bg-card`: #1E293B
- `--bg-hover`: #334155
- `--border`: #334155
- `--border-subtle`: #475569

**ADD NEW TOKEN:**
- `--bg-inactive`: #162130 (for paid/inactive rows)

## Color Hierarchy

| Layer | Color | Hex | Usage |
|-------|-------|-----|-------|
| Page/Base | bg-base | #0B1320 | Overall page background |
| Paid Rows | bg-inactive | #162130 | Paid/completed rows |
| Unpaid Rows | bg-surface | #1E293B | Default active rows |
| Hover | bg-hover | #334155 | Hover state (all rows) |
| Elevated | bg-elevated | #334155 | Cards, modals, popovers |

## Row Color Rules

### 1. Unpaid Rows (Default/Active)
```
background: var(--bg-surface)      // #1E293B
border: var(--border)               // #334155
text-primary: var(--text-primary)   // #E0E7FF
text-secondary: var(--text-secondary) // #FFFFFF
```
- Feel: active, current, actionable

### 2. Paid Rows (Inactive/Completed)
```
background: var(--bg-inactive)     // #162130 (NEW)
border: var(--border-subtle)         // #475569
text-primary: var(--text-primary)  // lower emphasis
text-secondary: var(--text-muted)   // muted
```
- Feel: inactive, completed, lower priority, visually quieter
- Do NOT use `--bg-elevated`

### 3. Hover State (All Rows)
```
background: var(--bg-hover)         // #334155
```
- Unpaid: #1E293B → #334155
- Paid: #162130 → #334155

### 4. Elevated Surfaces (UNCHANGED)
```
background: var(--bg-elevated)      // #334155
```
- Cards, modals, popovers

## Implementation

### Step 1: Add `--bg-inactive` Token

Add to `:root` in `app/globals.css`:
```css
--bg-inactive: #162130;
```

Also add to other themes (graphite-lime, mint-light) for consistency.

### Step 2: Update Paid Row Styles

In `app/globals.css`:

```css
/* Paid rows */
.expense-table tbody tr.is-paid { 
  background: var(--bg-inactive);
  border-color: var(--border-subtle);
}
.expense-table tbody tr.is-paid:hover { 
  background: var(--bg-hover);
}
```

### Step 3: Update Annual/Upcoming Row Styles

```css
/* Annual/inactive rows */
.annual-row { 
  background: var(--bg-inactive);
  border-color: var(--border-subtle);
}
.annual-row:hover { 
  background: var(--bg-hover);
}
```

### Step 4: Verify Text Hierarchy (Optional but Recommended)

If not already set, ensure in `:root`:
```css
--text-primary: #E0E7FF;   // Main text
--text-secondary: #94A3B8;  // Muted text
--text-muted: #6B7280;       // Very muted
--text-accent: #3B82F6;     // Links/accents
```

## Verification

1. **Unpaid rows**: #1E293B background, visible border
2. **Paid rows**: #162130 background, subtle border
3. **Hover on unpaid**: #1E293B → #334155
4. **Hover on paid**: #162130 → #334155
5. **Cards/modals**: Still use #334155 (bg-elevated) - unchanged

## TODOs

- [x] 1. Add --bg-inactive token to midnight-blue theme
- [x] 2. Add --bg-inactive to graphite-lime theme
- [x] 3. Add --bg-inactive to mint-light theme
- [x] 4. Update .is-paid row styles
- [x] 5. Update .annual-row styles
- [x] 6. Verify hover works on both row types
- [x] 7. Verify cards/modals unchanged
