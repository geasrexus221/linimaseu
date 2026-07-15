# Implementation Plan - Total Responsive Layout Overhaul

Transform the application from a simple mobile view to a professional, 3-column adaptive layout for PC/Desktop view.

## Proposed Changes

### 1. Global Layout System

#### [NEW] `src/components/layout/ResponsiveLayout.jsx`
- Use CSS Grid to define the desktop structure:
  - `[ Sidebar Nav (250px) ] [ Main Content (Flexible) ] [ Stats Panel (300px) ]`
- Use Media Queries to switch back to the mobile structure:
  - `[ Header (Top) ] [ Main Content ] [ TabBar (Bottom) ]`

### 2. Component Adaptations

#### [MODIFY] [TabBar.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/components/layout/TabBar.jsx)
- Add a "Desktop Variant":
  - Vertical orientation.
  - Icons and labels side-by-side.
  - Hover effects optimized for mouse pointers.

#### [MODIFY] [Header.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/components/layout/Header.jsx)
- Hide the "Stats Group" (Hearts, Obor, Crowns) on desktop view, as they will be moved to the side panel.

#### [NEW] `src/components/layout/DesktopStatsPanel.jsx`
- A dedicated panel for PC view containing:
  - User profile summary.
  - Real-time status pills (Hearts/Obor with timers).
  - Mini Leaderboard.

### 3. Integration

#### [MODIFY] [App.jsx](file:///c:/Users/Laxus/Desktop/Project%20Linimasa/src/App.jsx)
- Wrap the `ViewRouter` and auth flow within the `ResponsiveLayout`.

## Visual Strategy

- **Mobile**: Thumb-friendly, vertical scroll, bottom navigation.
- **Desktop**: Dashboard-style, minimal scrolling, quick access to stats and navigation.
- **Transitions**: Smooth window resizing behavior.

## Verification Plan

- **Mobile View (360px - 600px)**:
  - Verify bottom TabBar and top Header are present.
- **Desktop View (> 1024px)**:
  - Verify 3-column layout.
  - Verify stats are visible in the right panel.
  - Verify navigation is a left sidebar.
