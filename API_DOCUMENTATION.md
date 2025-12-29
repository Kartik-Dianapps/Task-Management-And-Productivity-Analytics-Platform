# 📘 API Documentation  
**Final Re-Assessment | Batch 2025**

Base URL: http://localhost:5000/api/v1


All protected routes require:
Authorization: Bearer <JWT_TOKEN>

---

## 🔐 Authentication APIs

## Register User

POST /auth/register
**Access:** Public  

**Body**
```json
{
  "username": "kartik",
  "email": "kartik@test.com",
  "password": "Password@123",
  "fullName": "Kartik Bisht",
  "role": "user"
}

Login User

POST /auth/login
{
  "email": "kartik@test.com",
  "password": "Password@123"
}


Logout User:

POST /auth/logout


Current User:

GET /auth/me

Update Profile 

PUT /auth/profile


## Task Management API's

Create Tasks:
POST /tasks

List Tasks:
GET /tasks

Search Tasks:
GET /tasks/search?q=keyword

My Assigned Tasks:
GET /tasks/my-tasks

Get Task By Id:
GET /tasks/:id

Update Tasks:
PUT /tasks/:id

Delete Tasks:
DELETE /tasks/:id

Complete Task:
PATCH /tasks/:id/complete


## Comments API's

Add Comment to tasks:
POST /tasks/:taskId/comments

Get Task Comments:
GET /tasks/:taskId/comments

Update comment:
PUT /comments/:id

Delete comment:
DELETE /comments/:id


## Analytics API's

Overview Analytics:
GET /analytics/overview

User Analytics:
GET /analytics/user/:userId

Trending Analytics:
GET /analytics/tasks/trending




