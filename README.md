# FarmDirect — Field to Table Marketplace

FarmDirect is a full-stack web application designed to **connect farmers directly with consumers**, eliminating middlemen and ensuring **fair pricing, transparency, and fresh produce delivery**.

The platform enables farmers to list their harvest and consumers to browse, filter, and purchase products directly — creating a **digital farm-to-table ecosystem**.

---

## Features

### Consumer Side

* Browse fresh produce from local farmers
* Search, filter, and sort products
* Add items to cart
* Dynamic cart with quantity control
* Order tracking UI (dashboard ready)

### Farmer Side

* Farmer dashboard with:

  * Earnings overview
  * Order tracking
  * Inventory status
* Add and manage product listings
* View recent orders

### ⚙️ Core Functionalities

* Real-time product filtering & sorting
* Global state management (Cart system)
* Modular component-based UI
* Responsive and clean UI design

---

## 🧠 Problem Statement

Traditional agricultural supply chains involve multiple intermediaries, which:

* Reduce farmers' profit margins
* Increase prices for consumers
* Reduce transparency

FarmDirect solves this by:

> Enabling **direct farmer-to-consumer transactions** through a digital platform.

---

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Package management: npm workspaces

---

## 📁 Project Structure

apps/
├── backend/   # Express API service
└── frontend/  # React + Vite web app
```

---

## Getting Started

###  Clone the Repository

```bash
git clone https://github.com/your-username/farmdirect.git
cd farmdirect
```

###  Install Dependencies

### Install dependencies per workspace

```bash
npm install --workspace @farmdirect/frontend
npm install --workspace @farmdirect/backend
```

### Run the frontend

```bash
npm run dev:frontend
```

### Run the backend

```bash
npm run dev:backend
```

## Available Root Scripts

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run lint`
- `npm run start:backend`

## Backend Environment

Copy `apps/backend/.env.example` to `.env` inside `apps/backend` and update values as needed.

---

##  How to Contribute

If you’d like to contribute:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

3. Make changes and commit

```bash
git commit -m "Added new feature"
```

4. Push to your fork

```bash
git push origin feature/your-feature-name
```

5. Create a Pull Request 

---

##  Acknowledgements

This project is part of a larger vision to:

> Empower farmers using technology and build a **sustainable digital agriculture ecosystem**.

---

## 📬 Contact

**Abhishek Pandey**
Feel free to connect or contribute!

---

⭐ If you like this project, consider giving it a star!



