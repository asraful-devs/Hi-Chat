<div align="center">

# 💬 Hi-Chat

### A Modern Real-Time Chat Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

_Seamless conversations, beautifully crafted._

</div>

---

## ✨ Overview

**Hi-Chat** is a full-stack real-time messaging platform built with modern web technologies. It delivers instant communication with a sleek, responsive interface designed for an exceptional user experience.

The application features end-to-end real-time messaging powered by WebSockets, secure authentication, cloud-based media handling, and enterprise-grade security measures.

---

## 🎯 Key Features

| Feature                 | Description                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Real-Time Messaging** | Instant message delivery using Socket.io with live typing indicators and online status |
| **User Authentication** | Secure JWT-based authentication with encrypted password storage                        |
| **Profile Management**  | Customizable user profiles with cloud-hosted avatars                                   |
| **Media Sharing**       | Seamless image uploads powered by Cloudinary CDN                                       |
| **Contact Discovery**   | Browse contacts and view conversation history                                          |
| **Online Presence**     | Real-time online/offline status tracking                                               |
| **Email Notifications** | Welcome emails and notifications via Resend                                            |
| **Security Shield**     | Rate limiting, bot detection, and attack prevention with Arcjet                        |

---

## 🛠️ Tech Stack

### Frontend

- **React 19** — Latest React with concurrent features
- **TypeScript** — Type-safe development
- **Vite 7** — Next-generation frontend tooling
- **TailwindCSS 4** — Utility-first CSS framework
- **DaisyUI** — Beautiful component library
- **Zustand** — Lightweight state management
- **React Router 7** — Client-side routing
- **Socket.io Client** — Real-time bidirectional communication

### Backend

- **Node.js & Express** — Fast, unopinionated server framework
- **TypeScript** — End-to-end type safety
- **MongoDB & Mongoose** — NoSQL database with elegant ODM
- **Socket.io** — WebSocket server for real-time events
- **JWT** — Stateless authentication tokens
- **bcrypt** — Industry-standard password hashing

### Cloud & Security

- **Cloudinary** — Media storage and optimization
- **Resend** — Transactional email delivery
- **Arcjet** — Application security (rate limiting, bot protection, shield)

---

## 🎨 Design Philosophy

Hi-Chat embraces a modern, minimalist aesthetic with:

- **Glassmorphism UI** — Frosted glass effects with backdrop blur
- **Gradient Accents** — Subtle pink and cyan ambient lighting
- **Dark Theme** — Eye-friendly slate color palette
- **Responsive Layout** — Seamless experience across all devices
- **Smooth Animations** — Polished micro-interactions

---

## 📁 Project Structure

```
hi-chat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & API client
│   │   ├── pages/          # Route pages
│   │   └── store/          # Zustand state stores
│   └── public/             # Static assets
│
├── server/                 # Express backend
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── emails/         # Email templates & handlers
│       ├── lib/            # Core utilities & integrations
│       ├── middleware/     # Auth & security middleware
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API route definitions
│       └── types/          # TypeScript interfaces
│
└── package.json            # Root workspace config
```

---

## 🔒 Security Features

Hi-Chat implements multiple layers of security:

- **Arcjet Shield** — Protection against common web attacks (SQL injection, XSS)
- **Bot Detection** — Blocks malicious automated requests while allowing search engines
- **Rate Limiting** — Sliding window algorithm (100 requests/60 seconds)
- **Secure Cookies** — HTTP-only JWT tokens with proper CORS configuration
- **Password Encryption** — bcrypt with salt rounds for secure credential storage
- **Input Validation** — Server-side sanitization and validation

---

## 📡 API Endpoints

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| `POST` | `/api/auth/signup`      | Register new user     |
| `POST` | `/api/auth/login`       | Authenticate user     |
| `POST` | `/api/auth/logout`      | End session           |
| `GET`  | `/api/auth/check`       | Verify authentication |
| `PUT`  | `/api/auth/profile`     | Update profile        |
| `GET`  | `/api/message/contacts` | Get all contacts      |
| `GET`  | `/api/message/chats`    | Get chat partners     |
| `GET`  | `/api/message/:id`      | Get conversation      |
| `POST` | `/api/message/send/:id` | Send message          |

---

## 🌐 WebSocket Events

| Event            | Direction       | Description                |
| ---------------- | --------------- | -------------------------- |
| `connection`     | Client → Server | User connects to socket    |
| `disconnect`     | Client → Server | User disconnects           |
| `getOnlineUsers` | Server → Client | Broadcast online user list |
| `newMessage`     | Server → Client | Real-time message delivery |

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

---

<div align="center">

**Built with ❤️ for seamless communication**

[Report Bug](https://github.com/asraful-devs/Hi-Chat/issues) · [Request Feature](https://github.com/asraful-devs/Hi-Chat/issues)

</div>
