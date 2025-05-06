# Internal Rideshare App

A cross-platform mobile application designed for internal workplace ridesharing, built using **React Native (Expo)** for the frontend and **AdonisJS** for the backend. This app aims to reduce commuting costs, carbon emissions, and promote community within organisations by allowing employees to coordinate shared rides easily and securely.

## 📱 About the Project

The Internal Rideshare App was inspired by real-world observations made during an industrial placement, where a need for efficient, internal commuting solutions became evident. Unlike commercial rideshare apps such as Uber or Lyft, which serve the general public, this app targets **intra-organisational** use—allowing colleagues to offer and book rides within their workplace environment.

### 🌟 Key Features

- 🔐 **Secure Authentication**: Firebase Auth integrated and synchronised with the backend.
- 🗺️ **Location System**: Create, reuse, and manage frequently used locations.
- 🧭 **Trip Management**: Plan and visualise rides, with control over seats and participants.
- 💬 **In-App Chat**: Real-time group messaging powered by Firebase Firestore.
- 🛠️ **Admin Dashboard**: Whitelist management and user role control.
- 📆 **One-Time Journeys**: Flexible trip planning without rigid scheduling.
- 📲 **Cross-Platform**: Built using Expo for compatibility with Android and iOS.

## ⚙️ Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: AdonisJS (Node.js framework)
- **Database**: SQLite
- **Authentication**: Firebase Authentication
- **Real-time Messaging**: Firebase Firestore

## 🧪 Development Approach

- **Methodology**: Kanban
- **Tools Used**: GitHub Projects for task tracking, Figma for UI/UX design
- **CI/CD**: Lightweight, iterative deployment strategy aligned with Kanban

## 🚀 Deployment

- A public Android APK is available via GitHub Releases.
- iOS deployment is currently limited due to Apple Developer Program constraints.

## 📈 Impact

This app has the potential to:
- Cut down carbon emissions by encouraging carpooling
- Lower commuting expenses for staff
- Enhance team bonding through shared travel

## 📂 Project Structure

The codebase is split into:

- `/frontend` – React Native Expo project
- `/backend` – AdonisJS API server
