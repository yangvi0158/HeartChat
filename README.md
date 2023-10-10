<div align="center">
  <img src="/frontend/public/heartChat-logo.svg?raw=true " alt="Alt text" title="Optional title">
</div>
<h1 align="center">
  HeartChat - v1
</h1>
<p align="center">
  <a href="https://heart-chat.com" target="_blank">https://heart-chat.com</a>
</p>
<p align="center">
  HeartChat is a real-time chat application built with Next.js, Express, and WebSocket.
</p>
<p align="center">
  It enables people to meet new friends from all over the world 🌍
</p>
<img src="../serve-image/frontend/public/readme_hompage.png" alt="HeartChat1" title="HeartChat homepage">

## 🌈 Features
- Third-party login (Google, Twitter, Github)
- Users can create, join, and leave multiple chatrooms
- Supports texts, emojis, and images as messages
- Responsive interface that makes you seamlessly chat across devices

## 🗃️ Built With
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://www.npmjs.com/package/socket.io)

## 📝 Prerequisites
- [Node JS](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/)

## 🛠 Installation & Set Up

1. Install and use the correct version of Node using [NVM](https://github.com/nvm-sh/nvm)
   ```sh
   nvm install
   ```
2. Set the required environment variables as given in env examples (including frontend, backend)
3. Install NPM packages for frontend and start server
```sh
   cd frontend
   yarn install
   yarn run dev
```
4. Install NPM packages for backend and start the server
```sh
   cd backend
   yarn install
   node server.js
```

## 🚀 Building and Running for Production via Docker-Compose

1. cd into cloned directory
   ```sh
   cd HeartChat
   ```
2. Create a network, which allows containers to communicate with each other, by using their container name as a hostname
  ```sh
   docker network create my_network
   ```
3. Build Docker Image
   ```sh
   docker-compose -f docker-compose.prod.yml build
   ```
4. Up prod in detached mode

   ```sh
   docker-compose -f docker-compose.prod.yml up -d
   ```
5. Check both containers are running
   ```sh
   docker ps
   ```

## ENV

## 🎨 Color Reference

| Color          | Hex                                                                |
| -------------- | ------------------------------------------------------------------ |
| Beige           | ![#EAE4DF](https://via.placeholder.com/10/EAE4DF?text=+) `#EAE4DF` |
| Green     | ![#22FFB5](https://via.placeholder.com/10/22FFB5?text=+) `#22FFB5` |
| Black  | ![#000000](https://via.placeholder.com/10/000000?text=+) `#000000` |
| White          | ![#FFFFFF](https://via.placeholder.com/10/FFFFFF?text=+) `#FFFFFF` |

postgres
