Perfect! We can combine all three tasks into a **single structured README** for your Elevate Labs Internship repository, keeping each task separate and clear. Here’s a polished version:

````markdown
# Elevate Labs Internship Projects

This repository contains my completed tasks for the **Elevate Labs Internship**. Each task demonstrates different skills in **web development**, **JavaScript interactivity**, and **Node.js backend development**.

---

## **Task 1: Responsive Landing Page**

A **Responsive Landing Page** built using **HTML & CSS**.

### 🚀 What We Built
- Header, hero section, services, projects, contact, and enquiry form.
- Responsive design using **Flexbox & media queries**.
- Footer with **animated social media icons** linking to login pages.

### 🛠️ How to Run
1. Clone this repository:
```bash
git clone https://github.com/Kanishsenthilkumar/Elevate-labs-internship.git
````

2. Open the `task-1/index.html` file in your browser.

---

## **Task 2: Responsive To-Do App**

A **full-featured To-Do App** built using **HTML, CSS, & JavaScript**.
Designed as a single-page web application with modern UI/UX features.

### ✨ Features

* **Interactive Task Management**:

  * Add tasks with titles and optional due dates.
  * Mark tasks as completed (updates a live progress bar).
  * Delete tasks with smooth animations.
* **Dynamic UI**:

  * Countdown timer for tasks with due dates.
  * Tasks marked as **overdue** when deadlines pass.
  * Live progress bar updates.
* **Modern & Responsive Design**:

  * Full-page background image.
  * Light/Dark theme toggle.
  * Fully responsive layout for mobile, tablet, and desktop.
* **Enhanced User Experience**:

  * Drag-and-drop task reordering.
  * Filters for `All`, `Active`, `Completed`, and `Overdue`.
  * Toast notifications for user actions.

### 🚀 Technology Stack

* **HTML5**: Semantic structure.
* **CSS3**: Styling, theming, layout with flexbox, animations.
* **JavaScript (ES6+)**: Core logic, real-time updates, data persistence via Local Storage.

### 🛠️ How to Run

1. Open `task-2/index.html` in a browser.
2. All features work without a backend.

---

## **Task 3: REST API to Manage a List of Books**

A **Node.js & Express REST API** to manage books (in-memory storage, no database).

### 🚀 Features

* **GET /books** – Retrieve all books.
* **POST /books** – Add a new book.
* **PUT /books/:id** – Update a book by ID.
* **DELETE /books/:id** – Remove a book by ID.

### 🛠️ How to Run

1. Navigate to the project folder:

```bash
cd task-3
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

4. API runs on `http://localhost:3000`.

### 📦 Example Book Object

```json
{
  "id": 1,
  "title": "1984",
  "author": "George Orwell"
}
```

### 🔗 Testing

Use **Postman** or any API client to test endpoints:

* GET: `http://localhost:3000/books`
* POST: `http://localhost:3000/books`
* PUT: `http://localhost:3000/books/:id`
* DELETE: `http://localhost:3000/books/:id`

---

```
