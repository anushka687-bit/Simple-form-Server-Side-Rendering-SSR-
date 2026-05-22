# 📘 Task 6: API Integration and Front-End Interaction

## 🧩 Project Title
Full Stack CRUD Application with REST API Integration and Admin Panel

---

## 🎯 Objective
To introduce server-client communication using RESTful API and connect it with a frontend interface for performing CRUD (Create, Read, Update, Delete) operations.

---

## 🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript / React  
- Backend: Node.js, Express.js  
- Database: MongoDB (Mongoose)  
- Authentication: JWT (if implemented)  
- Tools: VS Code, Postman  

---

## ⚙️ Features

### 🔐 Authentication System
- User and Admin login system  
- Secure authentication using JWT  
- Role-based redirection (Admin → Dashboard, User → Home)

---

### 📡 REST API Integration
Backend APIs implemented:
- POST `/register` → User registration  
- POST `/login` → User authentication  
- GET `/data` → Fetch records  
- POST `/data` → Create new record  
- PUT `/data/:id` → Update record  
- DELETE `/data/:id` → Delete record  

---

### 🖥️ Frontend Interaction
- Frontend connected to backend using fetch/axios  
- Dynamic rendering of API data  
- Forms for adding and updating data  
- Real-time updates after CRUD operations  

---

### 🧑‍💼 Admin Panel
- Separate admin dashboard  
- View all records  
- Edit and delete records  
- Protected routes using authentication  

---

### 🌙 UI Enhancements
- Dark mode toggle feature  
- Responsive design  
- Interactive and user-friendly interface  

---

## 🔄 Workflow

1. User/Admin logs in from frontend  
2. Backend validates credentials  
3. JWT token is generated  
4. Token is stored and used for protected API calls  
5. CRUD operations are performed via API requests  
6. UI updates dynamically based on backend response  

---

## 🧠 Key Learnings
- Building RESTful APIs using Node.js and Express  
- Connecting frontend with backend services  
- Authentication and authorization using JWT  
- Performing CRUD operations dynamically  
- Understanding full-stack architecture  

---

## 🚀 Outcome
Successfully developed a full-stack CRUD application with:
- Working backend APIs  
- Interactive frontend UI  
- Admin dashboard  
- Secure authentication system  
- Real-time data interaction between client and server  

---

## 📌 Note
This project demonstrates complete server-client integration using REST APIs and modern web development practices.