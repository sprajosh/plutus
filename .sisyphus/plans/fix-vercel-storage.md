# Fix Vercel Deployment - Storage Issue

## Context

App crashes on Vercel when toggling paid status because the filesystem is read-only (`EROFS: read-only file system`).

## Root Cause

`storage.ts` uses `fs.writeFileSync()` which doesn't work on Vercel's serverless functions.

## Solution

Switch to client-side localStorage for persistence. This works on Vercel and is suitable for personal use.

## Work Objectives

1. Create localStorage-based storage module
2. Update actions to use new storage
3. Test locally

## TODOs

- [ ] 1. Create localStorage storage module
- [ ] 2. Update actions.ts to use new storage
- [ ] 3. Test toggle functionality
