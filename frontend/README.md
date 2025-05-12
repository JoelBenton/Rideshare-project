# 🚀 Frontend Application Overview

This document outlines the structure of the **frontend/app** directory of the project. The application follows a modular structure using file-based routing (Next.js), separating major areas of functionality into nested routes and layout groups.

---

## 🌐 App Structure

### 📁 Root Level

| Path | Description |
|------|-------------|
| [`_layout.tsx`](./app/app/_layout.tsx) | Root layout that wraps all other routes. |
| [`index.tsx`](./app/index.tsx) | Landing or welcome page of the application. |

---

### 🔐 (auth) - Authentication

| File | Description |
|------|-------------|
| [`_layout.tsx`](./app/(auth)/_layout.tsx) | Layout for authentication pages. |
| [`login.tsx`](./app/(auth)/login.tsx) | Login screen for user authentication. |

---

### 🧭 (tabs) - Main Tabbed Navigation

This section contains the primary navigation tabs for the user.

| File | Description |
|------|-------------|
| [`_layout.tsx`](./app/(tabs)/_layout.tsx) | Layout for the (tabs) section. |
| [`admin.tsx`](./app/(tabs)/admin.tsx) | Administrative dashboard for managing the app. |

#### 🧳 (trips) - Trips Feature

| File | Description |
|------|-------------|
| [`[id].tsx`](./app/(tabs)/(trips)/[id].tsx) | View details of a specific trip. |
| [`_layout.tsx`](./app/(tabs)/(trips)/_layout.tsx) | Layout wrapper for trip-related pages. |
| [`create_form.tsx`](./app/(tabs)/(trips)/create_form.tsx) | Form to add details to a new trip during the creation process. |
| [`create_locations.tsx`](./app/(tabs)/(trips)/create_locations.tsx) | Interface to add locations to a trip in the creation process. |
| [`history.tsx`](./app/(tabs)/(trips)/history.tsx) | View user's past trips. |
| [`requested.tsx`](./app/(tabs)/(trips)/requested.tsx) | List of trips the user has requested to join. |
| [`search.tsx`](./app/(tabs)/(trips)/search.tsx) | Search available trips. |
| [`upcoming.tsx`](./app/(tabs)/(trips)/upcoming.tsx) | Display upcoming trips for the user. |

#### 💬 chat - Messaging System

| File | Description |
|------|-------------|
| [`[id].tsx`](./app/(tabs)/chat/[id].tsx) | Group chat based on chat ID. |
| [`_layout.tsx`](./app/(tabs)/chat/_layout.tsx) | Layout for chat screens. |
| [`index.tsx`](./app/(tabs)/chat/index.tsx) | Chat home screen showing Group conversations. |

#### 🏠 home - Home Dashboard

| File | Description |
|------|-------------|
| [`_layout.tsx`](./app/(tabs)/home/_layout.tsx) | Layout for home screens. |
| [`index.tsx`](./app/(tabs)/home/index.tsx) | Home dashboard showing an overview. |

#### 📍 locations - Location Management

| File | Description |
|------|-------------|
| [`[id].tsx`](./app/(tabs)/locations/[id].tsx) | View detailed info for a specific location. |
| [`_layout.tsx`](./app/(tabs)/locations/_layout.tsx) | Layout wrapper for location pages. |
| [`create.tsx`](./app/(tabs)/locations/create.tsx) | Create a new public or private location. |
| [`index.tsx`](./app/(tabs)/locations/index.tsx) | Home Menu to show private and public locations. |
| [`locations_map.tsx`](./app/(tabs)/locations/locations_map.tsx) | Map view showing saved locations. |

#### 👤 profile - User Profile

| File | Description |
|------|-------------|
| [`_layout.tsx`](./app/(tabs)/profile/_layout.tsx) | Layout for profile pages. |
| [`changePassword.tsx`](./app/(tabs)/profile/changePassword.tsx) | Change password screen. |
| [`index.tsx`](./app/(tabs)/profile/index.tsx) | Main profile page for viewing and editing user details. |

---

## 🧩 Notes

- Parentheses in folder names (e.g. `(auth)`, `(tabs)`) indicate **layout groups**, used in Next.js to wrap related routes with shared UI/layout.
- Square brackets in filenames (e.g. `[id].tsx`) indicate **dynamic routes**.
