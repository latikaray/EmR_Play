

# Gamification System: Badges, XP, Streaks & Unlockable Avatars

## Overview
Add a full gamification layer for both child and parent modules — XP points earned per activity, badges unlocked at milestones, daily streaks tracked, and avatar items unlocked at XP thresholds.

---

## Database Changes (Migration)

### New Tables

1. **`user_xp`** — tracks cumulative XP per user
   - `id`, `user_id`, `total_xp` (int, default 0), `current_streak` (int, default 0), `longest_streak` (int, default 0), `last_active_date` (date), `created_at`, `updated_at`
   - RLS: users can read/update their own row; parents can view linked children

2. **`user_badges`** — badges earned by users
   - `id`, `user_id`, `badge_id` (text), `earned_at` (timestamptz)
   - RLS: users manage own; parents can view linked children

3. **`unlocked_avatars`** — avatar items unlocked via XP
   - `id`, `user_id`, `avatar_id` (text), `unlocked_at`
   - RLS: users manage own

### No new storage buckets needed — avatar images will be bundled as static assets (emoji-based).

---

## Badge & Avatar Definitions (Static Data)

Create **`src/data/gamificationData.ts`** containing:

- **Badge definitions** (~15 badges) with `id`, `name`, `description`, `emoji`, `requirement` (e.g., "Complete 5 activities", "7-day streak", "Try all activity types")
  - Child badges: Creative Star, Emotion Explorer, Zen Master, Story Hero, 7-Day Streak, etc.
  - Parent badges: Reflective Parent, Guide Reader, Role Play Pro, Quiz Champion, etc.

- **XP rules**: points per activity type (e.g., activity completion = 50 XP, journal entry = 30 XP, quiz = 40 XP, streak bonus = 20 XP/day)

- **Unlockable avatars** (~10): emoji-based avatars unlocked at XP thresholds (100, 250, 500, 1000, etc.)

---

## New Hook: `useGamification`

**`src/hooks/useGamification.tsx`**

- Fetches `user_xp`, `user_badges`, `unlocked_avatars` from Supabase
- `awardXP(amount, reason)` — adds XP, checks streak, auto-awards badges if thresholds met
- `checkAndUpdateStreak()` — called on login/activity; compares `last_active_date` to today
- `getUnlockedAvatars()` — returns avatars user has earned
- `selectAvatar(avatarId)` — sets active avatar on profile
- Badge check logic runs after each XP award

---

## UI Changes

### 1. XP & Streak Bar (Layout Component)
Add a persistent XP bar to the child `HomePage` and parent `ParentHomePage`:
- Shows current XP, level (XP/threshold), streak flame icon with count
- Animated progress bar

### 2. Badges Page — `src/pages/BadgesPage.tsx`
- Grid of all available badges (locked ones greyed out)
- Earned badges shown with glow effect and earned date
- Progress indicator for partially-met requirements

### 3. Avatar Selection — Update `ProfilePage.tsx`
- New "Unlockable Avatars" section showing earned + locked avatars
- Locked ones show XP needed to unlock
- Click to select as active avatar

### 4. Activity Completion XP Toast
- Update `useActivityProgress.recordActivityCompletion` to also call `awardXP`
- Show "+50 XP" animation toast on completion
- If badge earned, show a special badge-earned notification

### 5. Update HomePage & ParentHomePage
- Replace hardcoded stats with real XP, streak, badge count from `useGamification`
- Add "View Badges" link

### 6. Route Addition
- `/badges` — BadgesPage (accessible to both roles)

---

## Files to Create
- `supabase/migrations/` — new migration for 3 tables + RLS
- `src/data/gamificationData.ts` — badge/avatar/XP definitions
- `src/hooks/useGamification.tsx` — core gamification logic
- `src/pages/BadgesPage.tsx` — badges & avatars display

## Files to Edit
- `src/App.tsx` — add `/badges` route
- `src/pages/HomePage.tsx` — integrate real XP/streak/badges stats
- `src/pages/ParentHomePage.tsx` — integrate real stats
- `src/pages/ProfilePage.tsx` — add unlockable avatar selection
- `src/hooks/useActivityProgress.tsx` — hook into XP award on completion

