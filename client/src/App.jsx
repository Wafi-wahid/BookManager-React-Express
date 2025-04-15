import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch books from the backend when the component is mounted
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch the books list
  const fetchBooks = async () => {
    try {
      const response = await axios.get(API);
      setBooks(response.data); // Set fetched books to state
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Handle form submission (add or update book)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing book
      axios
        .put(`${API}/${editingId}`, form)
        .then(fetchBooks)
        .catch((err) => console.error("Error updating book:", err));
      setEditingId(null);
    } else {
      // Add new book
      axios
        .post(API, form)
        .then(() => {
          fetchBooks(); // Fetch updated list after adding a new book
        })
        .catch((err) => console.error("Error adding book:", err));
    }

    setForm({ title: "", author: "" });
  };

  // Delete book by ID
  const handleDelete = (id) => {
    axios
      .delete(`${API}/${id}`)
      .then(fetchBooks)
      .catch((err) => console.error("Error deleting book:", err));
  };

  // Set form values to edit the selected book
  const handleEdit = (book) => {
    setForm({ title: book.title, author: book.author });
    setEditingId(book.id);
  };

  return (
    <div className="app-container">
      <h1>📚 Book Manager</h1>

      {/* Form to Add or Edit a Book */}
      <form onSubmit={handleSubmit} className="form">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          required
        />
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author"
          required
        />
        <button>{editingId ? "Update Book" : "Add Book"}</button>
      </form>

      {/* List of books */}
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <div>
                <strong>{book.title}</strong> by {book.author}
              </div>
              <div>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books available. Add a new book!</p>
      )}
    </div>
  );
}

export default App;
