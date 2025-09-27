# QR-Based Attendance System

A comprehensive attendance management system using QR codes with separate interfaces for faculty and students.

## Project Structure

```
├── frontend/          # React + Vite web application for faculty
├── backend/           # Firebase configuration and cloud functions
├── mobile-app/        # Flutter application for students
├── docs/              # Documentation and project planning
└── README.md
```

## Technology Stack

- **Frontend (Faculty)**: React + Vite
- **Backend**: Firebase (Authentication, Firestore Database, Cloud Functions)
- **Mobile App (Students)**: Flutter
- **QR Code Generation**: React QR libraries
- **Authentication**: Firebase Auth

## Features

### Faculty Web Interface
- Faculty login and dashboard
- QR code generation for attendance sessions
- Real-time attendance monitoring
- Attendance reports and analytics
- Course and student management

### Student Mobile App
- Student authentication
- QR code scanner
- Attendance history
- Course enrollment

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Flutter SDK
- Firebase CLI
- Git

### Installation

1. Clone the repository
2. Set up frontend: `cd frontend && npm install`
3. Set up Flutter app: `cd mobile-app && flutter pub get`
4. Configure Firebase project
5. Deploy and run

## Development Status
- ✅ Project structure setup
- 🔄 Frontend development in progress
- ⏳ Firebase configuration pending
- ⏳ Mobile app development pending

## License
MIT License