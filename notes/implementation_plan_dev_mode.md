# Implementation Plan - Role-Based Dev Mode Access

Implement conditional access to "Developer Mode" features based on the credentials used during student login.

## Proposed Changes

### 1. Global State Management

#### [MODIFY] [useStore.js](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/store/useStore.js)
- Add `isDevMode` (boolean, default: `false`) to the state.
- Add `setIsDevMode(val)` action to update the flag.

### 2. Login Logic

#### [MODIFY] [LoginScreen.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/auth/screens/LoginScreen.jsx)
- Update `handleLoginSubmit` to validate credentials specifically for the "Student" (Murid) login modal.
- **Normal Account**: `murid1` / `murid1` -> Sets `isDevMode` to `false`.
- **Dev Account**: `dev1` / `dev1` -> Sets `isDevMode` to `true`.
- Any other credentials (for now) will default to a normal account or generic login.

### 3. Conditional UI Rendering

#### [MODIFY] [SettingsMainScreen.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/settings/screens/SettingsMainScreen.jsx)
- Import `isDevMode` from the store.
- Hide the `Developer Mode` toggle and the `DevModeSection` entirely if `isDevMode` is `false`.

#### [MODIFY] [IntroScreen.jsx (Jelajah Nusantara)](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/features/game/jelajah-nusantara/screens/IntroScreen.jsx)
- Import `isDevMode` from the store.
- Conditionally render the `DEV Maker` button (the square action button with `PenTool` icon) only if `isDevMode` is `true`.

> [!IMPORTANT]
> No new features or UI elements will be created. The goal is strictly to restrict existing developer-oriented tools behind the `dev1` account.

## Verification Plan

- **Login Test (Normal Account)**:
  - Login as Murid with `murid1` / `murid1`.
  - Go to Settings -> Verify "Developer Mode" is NOT visible.
  - Go to Jelajah Nusantara Intro -> Verify "DEV Maker" button is NOT visible.
- **Login Test (Dev Account)**:
  - Login as Murid with `dev1` / `dev1`.
  - Go to Settings -> Verify "Developer Mode" IS visible.
  - Go to Jelajah Nusantara Intro -> Verify "DEV Maker" button IS visible and functional.
