# 💬 WGChat - Modern React Chat App

WGChat is a sleek and responsive chat platform featuring both a modern **React** frontend and a robust **Node.js/Express** backend. It delivers a clean user experience with:

- ✅ User selection and profile display  
- ✅ Real-time chat interface with media previews  
- ✅ Mobile and desktop responsive layout  
- ✅ Toggleable Right Sidebar for user details  
- ✅ RESTful API for chat, user, and media management

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JOSIAHTHEPROGRAMMER/WEGOCHAT.git
cd  WEGOCHAT
```

### 2. Install Frontend Dependencies

```bash
cd ../clientApp
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```
### 4. Create Environment Variables

create a `.env` file in the root of the 'clientApp' folder and add the following variables:

```
VITE_GIPHY_API_KEY=your_api_key
```

Create a `.env` file in the root of the `server` folder and add the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

### 5. Start the Backend Server

```bash
npm run dev
```
By default, the backend runs on: http://localhost:5000

### 6. Start the Frontend Development Server

```bash
cd ../clientApp
npm run dev
```
Then open your browser and navigate to: http://localhost:5173

---

## 🛠 Tech Stack

**Frontend:**
- React – Frontend library
- Tailwind CSS – Utility-first CSS framework
- Vite – Fast dev server and bundler
- Lucide-react – Beautiful icon set used throughout the UI
- Giphy API – Powered by https://developers.giphy.com/explorer/ for GIF support
- Dummy Data / Images – Used for development placeholders and previews

**Backend:**
- Node.js – JavaScript runtime
- Express – Web framework for RESTful APIs
- MongoDB – Database for storing users and messages
- Socket.io – Real-time communication for chat
- Multer – File uploads for media sharing

---

## Project Structure

```
/server        # Backend (Express, MongoDB, Socket.IO)
/client        # Frontend (React, Vite, Tailwind)
```

---

Feel free to explore both the frontend and backend folders for more details!

