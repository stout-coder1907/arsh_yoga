# Arsh Yoga — Premium Yoga & Wellness Platform

Editorial light aesthetic inspired by South Asian wellness traditions.

## Design Tokens
- **Background (Cream/Sand):** `#F7F5EE`
- **Primary (Deep Forest Green):** `#2B4C36`
- **Accent (Warm Gold):** `#B8893A`
- **Text (Charcoal):** `#1C1C1C`
- **Typography:** Serif headings (`Cormorant Garamond` / `Playfair Display`), sans body (`Inter`)

## Folder Structure

```
arsh-yoga/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Program.js
│   │   ├── Class.js
│   │   ├── Article.js
│   │   ├── Video.js
│   │   ├── Enrollment.js
│   │   └── Payment.js
│   ├── controllers/              # Route handlers
│   ├── routes/                   # Express routes
│   ├── middleware/               # Auth, error handlers
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/               # Imagery (Indian wellness placeholders)
    │   ├── components/           # Nav, Hero, ProgramCard, Footer
    │   ├── pages/                # Home, Programs, Classes, Journal, About
    │   ├── styles/               # tokens.css, global.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Entity Relationships

```
User ──< Enrollment >── Program ──< Class
  │                        │
  └──< Payment >───────────┘
  │
Program ──< Article
Program ──< Video
```

- A **User** has many **Enrollments**, each linking to one **Program**.
- A **Program** has many **Classes**, **Articles**, and **Videos**.
- A **Payment** belongs to a **User** and references the **Enrollment** it settled.
- An instructor (User with role `instructor`) is referenced by **Class** and **Program**.

## Backend Setup
```bash
cd backend && npm install && cp .env.example .env && npm run dev
```

## Frontend Setup
```bash
cd frontend && npm install && npm run dev
```
