# 🎥 YouTube Clone – Backend API

A production-style backend for a YouTube-like video sharing platform built using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.  
This project focuses on scalable REST APIs, secure authentication, media uploads, and efficient data retrieval using aggregation pipelines.

> Frontend integration (React) is in progress. Backend is fully functional, documented, and tested.

---

## 🚀 Features

- 🔐 JWT-based authentication with password hashing (bcrypt)  
- 📹 Video management: upload, fetch, update, delete  
- 💬 Comments, 👍 Likes, 📂 Playlists, 🔔 Subscriptions  
- 🧠 Channel dashboard APIs with analytics (views, uploads, subscribers)  
- 📰 Personalized home feed using aggregation pipelines  
- 🔎 Search APIs for videos and channels  
- 📤 Media uploads using Multer + Cloudinary  
- 📄 Pagination using `mongoose-aggregate-paginate-v2`  
- 🛡️ Centralized error handling & API response utilities  
- 🧩 MVC architecture with controllers, routes, models, middlewares, utils  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Auth & Security:** JWT, bcrypt, cookie-parser, CORS  
- **Media Upload:** Multer, Cloudinary  
- **Querying:** MongoDB Aggregation Pipeline, mongoose-aggregate-paginate-v2  
- **Tools:** Git, GitHub, Postman, dotenv  

---

## 🗂️ Project Structure

```
src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middlewares/
 ├── utils/
 ├── db/
 └── app.js
```

---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/ASIT-SINGHA/YT-clone_backend_nodejs.git
cd YT-clone_backend_nodejs
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables  
Create a `.env` file in the root:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4️⃣ Start the server
```bash
npm run dev
```

Server will start at:
```
http://localhost:8000
```

---

## 🔍 API Endpoints (Examples)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/v1/users/register | Register user |
| POST   | /api/v1/users/login    | Login user |
| GET    | /api/v1/videos         | Fetch videos |
| POST   | /api/v1/videos         | Upload video |
| POST   | /api/v1/comments       | Add comment |
| POST   | /api/v1/likes          | Like video |
| GET    | /api/v1/dashboard/channel/:id | Channel analytics |

> Full API  available via Postman collection [API Collection](https://github.com/ASIT-SINGHA/YT-clone_backend_nodejs/blob/main/Public/temp/yt%20clone.postman_collection.json).

---

## 🧪 Testing

- APIs tested using **Postman**  
- JWT-protected routes verified  
- File upload endpoints tested with multipart/form-data  

---

## 🙏 Acknowledgements

Special thanks to Hitesh Choudhary for mentorship and guidance during the development of this project.

---

## 👤 Author

**Asit Singha**  
- GitHub: https://github.com/ASIT-SINGHA  
- LinkedIn: [Asit Singha](https://www.linkedin.com/in/asit-kumar-singha/)
