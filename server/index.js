const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let books = [];
let id = 1;

// GET all books
app.get("/api/books", (req, res) => {
  res.json(books);
});

// POST create book
app.post("/api/books", (req, res) => {
  const book = { id: id++, ...req.body };
  books.push(book); // Adds the new book to the array
  console.log(books); // Log the books array to check if it's being added
  res.status(201).json(book); // Send back the new book
});

// PUT update book
app.put("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) return res.status(404).send("Book not found");
  books[index] = { id: bookId, ...req.body };
  res.json(books[index]);
});

// DELETE book
app.delete("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((b) => b.id !== bookId);
  res.sendStatus(204);
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
