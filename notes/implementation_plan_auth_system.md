# Implementation Plan - Login & Registration System

Introduce a comprehensive authentication system as the entry point of the application. The system will support three distinct login methods and a registration portal.

## Proposed Changes

### 1. Navigation & State

#### [MODIFY] [App.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/App.jsx)
- Replace `StartScreen` with a new `AuthRouter` component.
- The `AuthRouter` will manage the flow between Login, Registration, and the main application.

### 2. Authentication Components

#### [NEW] `src/features/auth/AuthRouter.jsx`
- Manages sub-views: `login` and `register`.
- Once authenticated, it triggers the `setHasStarted(true)` in the navigation store.

#### [NEW] `src/features/auth/screens/LoginScreen.jsx`
- **Email Login (Top)**: A primary button for email-based authentication.
- **Role-Based Login (Bottom Grid)**: Two side-by-side cards for "Murid" and "Guru".
- **Modal Popups**:
  - Email Popup: Fields for `Email` and `Password`.
  - Student/Teacher Popup: Fields for `Kode Akun` and `Password`.
- **Footer**: Link to the Registration screen ("Belum punya akun? Coba daftar").

#### [NEW] `src/features/auth/screens/RegisterScreen.jsx`
- A registration form for new users.
- Button to return to the Login screen.

### 3. Visual Design

- **Aesthetics**: Maintain the "Duolingo-style" (rounded corners, thick borders, vibrant colors).
- **Modals**: Smooth animations for popups using `framer-motion`.
- **Responsive**: Ensure the 3-way login grid looks good on "Android mode" (portrait mobile).

- **Form Features**:
  - Implement a "Password Peek" (eye icon) to toggle between hidden and visible password text.
  - Standard validation for empty fields.

## Verification Plan

- **Login Flow**:
  - Test clicking "Masuk dengan Email" -> Verify popup with email/pass fields.
  - Test clicking "Murid" or "Guru" -> Verify popup with account code/pass fields.
  - **Verify Password Peek**: Click the eye icon to ensure password visibility toggles correctly.
- **Navigation**:
  - Test clicking "Daftar" -> Navigate to Register screen.
  - Test "Kembali" from Register -> Return to Login screen.
- **UI/UX**:
  - Verify layout on narrow mobile viewports.
