# Task Management & Productivity Analytics API  
**Final Re-Assessment | Batch 2025**

This project is a **Node.js + Express backend application** that provides a **role-based task management system** with **productivity analytics, cron jobs, activity tracking, and advanced features**.

It is built following **clean architecture**, **REST principles**, and **production-ready practices**.

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (Single Login)
- **Validation**: Joi
- **Security**: bcrypt
- **File Upload**: Cloudinary
- **Scheduling**: node-cron
- **Logging & Analytics**: MongoDB Aggregation
- **Error Handling**: Centralized Global Error Handler

---

## 📁 Project Structure

src/
├── config/
├── models/
├── controllers/
├── routes/
├── middleware/
├── cron/
├── utils/
└── app.js

Project Setup Steps:

Step 1:
git clone <repository-url>
cd project-folder

Step 2 : 
npm install

Step 3 :
Setup the .env file in your project and put these below variables

PORT=5000
MONGO_URI=mongodb://localhost:27017/task-platform
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Step 4 : 
Start Server by:
npm run dev
