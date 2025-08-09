# 📌 Project Name
A simple task board and todo management app built with **Next.js App Router**, featuring authentication, server actions, and in-memory storage.

## 🚀 Tech Stack
- **Next.js** (App Router)
- **React.js**
- **Shadcn UI**
- **Lucide React Icons**
- **React Hook Form**
- **JWT** for authentication

## 🛠️ Features & Approach
- **Protected Routes** using Next.js Middleware and JWT verification.
- **Server Actions** to handle CRUD operations directly from components without separate API routes.
- **In-Memory DB** using JSON files to store boards and todos.
- **Board & Todo Management**:
  - Create, update, and delete boards.
  - Create, update, and delete todos for each board.
  - Priority, status, and due-date tracking for todos.
- **Shadcn UI** for beautiful, accessible components.
- **Lucide Icons** for lightweight and scalable icons.

## 📂 Project Structure
```bash
/app
/board
page.tsx
layout.tsx
page.tsx
/lib
jwt.ts
auth.ts
db.ts
/components
BoardCard.tsx
TodoCard.tsx
/middleware.ts
```


## ▶️ How to Run
1. **Clone the repository**
  ```bash
  git clone https://github.com/your-username/your-repo-name.git
  cd your-repo-name
  ```
2. **Install Dependencies**
  ```bash
  npm install
  ```
3. **Create .env.local file**
  ```bash
  JWT_SECRET=your_secret_key

  ```
4. **Run the development server**
  ```bash
  npm run dev
  ```