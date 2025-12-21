# TODO List 📝

<div align="center">

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[🇧🇷 Português](README.md) | [🇺🇸 English](README-en.md)

[View Demo](https://todo-list-web-9d1d7.web.app/) | [Report Bug](https://github.com/flaviare1s/todo-list/issues) | [Request Feature](https://github.com/flaviare1s/todo-list/issues)

</div>

---

## **📖 Overview**

A modern and collaborative task list application developed for **Frontend Day 2024**. This project allows multiple users to create, edit, and share tasks in real-time with secure authentication and responsive interface.

### ✨ **Highlights**

- 🔐 Secure authentication with Firebase (Email/Password and Google)
- 🤝 Collaborative task and list sharing
- ⚡ Real-time updates
- 📱 Responsive and modern interface
- 🔔 Real-time change notifications

---

## **🚀 Technologies Used**

### **Frontend**

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Build tool and dev server
- React Router - Page navigation
- React Hooks - State and effects management

### **Backend & Infrastructure**

- [Firebase Authentication](https://firebase.google.com/products/auth) - User authentication
- [Cloud Firestore](https://firebase.google.com/products/firestore) - Real-time NoSQL database
- [Firebase Hosting](https://firebase.google.com/products/hosting) - Web hosting
- Firestore Listeners - Real-time notifications

---

## **✨ Features**

### 🔐 **Authentication**

- ✅ User registration with email and password
- ✅ Login for existing users
- ✅ Google login (OAuth)
- ✅ Password reset
- ✅ Secure logout

### 📋 **Task Management**

- ✅ Create new tasks
- ✅ Edit existing tasks
- ✅ Delete tasks
- ✅ Mark tasks as completed
- ✅ Organization by lists

### 🤝 **Collaborative Sharing**

- ✅ **Individual Task Sharing**: Share specific tasks with editing permissions
- ✅ **Complete List Sharing**: Share entire lists in read-only mode
- ✅ Permission management (read/write)

### ⚡ **Real-Time**

- ✅ Instant updates for shared tasks
- ✅ Notifications of changes made by other users
- ✅ Automatic synchronization across devices

### 📊 **History and Audit**

- ✅ Record of task creator
- ✅ Record of task editor
- ✅ Last modification timestamp

---

## **⚙️ Installation and Setup**

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### **Step by Step**

#### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/flaviare1s/todo-list.git
cd todo-list
```

#### 2️⃣ **Install Dependencies**

```bash
npm install
# or
yarn install
```

#### 3️⃣ **Configure Firebase**

1. Access the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Go to **Project Settings** > **Your apps**
4. Select the Web app and copy the credentials
5. Create the `src/firebase/config.js` file:

```javascript
// src/firebase/config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export default app;
```

#### 4️⃣ **Start the Development Server**

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

---

## **🌐 Deployment**

The application is hosted on Firebase Hosting:

**🔗 [https://todo-list-web-9d1d7.web.app/](https://todo-list-web-9d1d7.web.app/)**

### To deploy:

```bash
npm run build
firebase deploy
```

---

## **📁 Project Structure**

```
todo-list/
├── src/
│   ├── assets/           # Static resources
│   ├── components/       # Reusable React components
│   │   ├── Header.jsx
│   │   ├── TodoItem.jsx
│   │   ├── ShareModal.jsx
│   │   └── ...
│   ├── contexts/         # React Context API
│   │   └── UserContext.jsx
│   ├── firebase/         # Firebase configuration and functions
│   │   ├── auth.js
│   │   ├── list.js
│   │   ├── share.js
│   │   └── todo.js
│   ├── pages/            # Application pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Todos.jsx
│   │   └── ...
│   ├── App.jsx           # Main component
│   └── main.jsx          # Entry point
├── public/               # Public files
├── firebase.json         # Firebase configuration
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

---

## **🎯 About the Frontend Day 2024 Challenge**

This project was developed in response to the **Frontend Day 2024** challenge, which proposed creating a collaborative task list application.

### **🎯 Challenge Objective**

Develop a complete web application for task management with support for multiple users, sharing, and real-time updates.

### **📋 Implemented Requirements**

#### ✅ User Authentication

- Firebase Authentication
- Email/password login and registration
- Google social login
- Password recovery

#### ✅ Task Management (CRUD)

- Create, edit, and delete tasks
- Mark tasks as completed
- Firestore storage
- Clear and organized interface

#### ✅ Collaborative Sharing

- Share lists and individual tasks
- Configurable permissions (read/write)
- Access management

#### ✅ Responsive Interface

- Modern design with Tailwind CSS
- Visual feedback for all actions
- Adaptable to different devices

#### ✅ Real-Time

- Firestore Listeners for instant updates
- Change notifications from other users
- Automatic synchronization

#### ✅ History and Security

- Creation and edit records
- Change timestamps
- Implemented Firestore Security Rules
- Data validation on frontend and backend

---

## **👨‍💻 Author**

Developed by [Flavia Reis](https://github.com/flaviare1s)

---

## **📄 License**

This project is under the MIT license. See the LICENSE file for more details.

---

## **🤝 Contributing**

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**⭐ If this project was helpful to you, consider giving it a star!**

[🇧🇷 Português](README.md) | [🇺🇸 English](README-en.md)

</div>
