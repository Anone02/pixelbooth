# 📸 PixelBooth

A full-stack themed photo booth web application that allows users to capture webcam photos, generate pixel-art style collages, and instantly download their creations.

Built with React, Node.js, and Supabase.

---

## ✨ Features

- 📷 Webcam photo capture (multi-shot session)
- 🎨 Theme-based UI (Snoopy, Furina, etc.)
- 🧩 Automatic collage generator using Canvas API
- 💾 Image upload to Supabase Storage
- 🗄️ Metadata storage in PostgreSQL (name, theme, image URL)
- ⚡ Full frontend → backend integration
- 🎭 Smooth UI animations with Framer Motion

---

## 🧠 Architecture

Frontend (React + TypeScript)
↓
Backend (Node.js + Express)
↓
Supabase Storage (Images)
↓
Supabase Database (Metadata)

---

## 🛠️ Tech Stack

Frontend:
- React + TypeScript
- Context API (Theme system)
- Canvas API (image processing)
- Framer Motion
- Webcam integration

Backend:
- Node.js + Express
- Supabase JS Client
- Base64 image processing
- REST API

Database & Storage:
- Supabase PostgreSQL
- Supabase Storage

---

## 🚀 How It Works

1. User enters name and selects a theme
2. Webcam captures multiple photos
3. Canvas API generates a pixel-art collage
4. Image is sent to backend as base64
5. Backend uploads image to Supabase Storage
6. Metadata (name, theme, image URL) is saved to database
7. Final collage is displayed and downloadable

---

## 📡 API

POST /upload

Request:
{
  "name": "user name",
  "theme": "snoopy",
  "image": "base64_image_string"
}

Response:
{
  "message": "Image uploaded successfully",
  "fileName": "snoopy-123456.png",
  "url": "https://your-supabase-url/storage/..."
}

---

## 🗃️ Database Schema

Table: photobooth_results

- id (uuid)
- name (text)
- theme (text)
- image_url (text)
- created_at (timestamp)

---

## 🎯 Key Highlights

- Real-time webcam capture
- Multi-photo collage generation using Canvas API
- Theme-based dynamic UI system
- Full-stack integration (frontend → backend → cloud)
- Supabase Storage + PostgreSQL implementation

---

## 📦 Future Improvements

- Authentication (Supabase Auth)
- Public gallery of user creations
- Auto delete images after 7 days
- Social sharing feature
- Custom frame templates

---

## 👨‍💻 Author

Built by a full-stack developer focused on React, Node.js, and cloud systems.
