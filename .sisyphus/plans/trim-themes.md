# Trim Themes to 3

## Context
User wants to keep only 3 themes and delete the other 16.

## Keep
1. midnight-blue (:root - existing)
2. graphite-lime 
3. mint-light

## Delete
All other themes: forest, sunset, slate, rose, forest-minimal, sunset-warm, cool-teal, deep-purple, ocean-blue, rose-soft, ice-blue, sand-light, pastel-simple, soft-lavender, peach-calm, mint-breeze, baby-blue

## Work Objectives
- Rewrite globals.css with only 3 themes
- Update settings page to show only 3 themes
- Fix .section-badge to use --text-secondary instead of --blue for better contrast

## TODOs
- [x] 1. Rewrite globals.css with 3 themes only (midnight-blue :root, graphite-lime, mint-light)
- [x] 2. Update settings page themes array to 3 themes
- [x] 3. Fix section-badge contrast issue (use --text-secondary instead of --blue)