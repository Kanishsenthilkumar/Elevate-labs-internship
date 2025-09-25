const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory "database" with 10 books
let books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien" },
  { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen" },
  { id: 6, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 7, title: "Moby Dick", author: "Herman Melville" },
  { id: 8, title: "Harry Potter and the Sorcerer’s Stone", author: "J.K. Rowling" },
  { id: 9, title: "The Catcher in the Rye", author: "J.D. Salinger" },
  { id: 10, title: "The Lord of the Rings", author: "J.R.R. Tolkien" }
];

// GET /books → get all books
app.get("/books", (req, res) => res.json(books));

// POST /books → add a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: "Title and Author required" });

  const newBook = { id: books.length ? books[books.length-1].id + 1 : 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id → update a book by ID
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const book = books.find(b => b.id === parseInt(id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (title) book.title = title;
  if (author) book.author = author;
  res.json(book);
});

// DELETE /books/:id → remove a book
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(b => b.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const deletedBook = books.splice(index, 1);
  res.json(deletedBook[0]);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
