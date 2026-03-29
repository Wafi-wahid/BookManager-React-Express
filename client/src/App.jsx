import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  // Fetch all todos on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add todo
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    const res = await axios.post("http://localhost:5000/api/todos", { task });
    setTodos([...todos, res.data]);
    setTask("");
  };

  // Toggle complete
  const handleToggle = async (todo) => {
    const res = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
      task: todo.task,
      completed: !todo.completed,
    });
    setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
  };

  // Delete todo
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  return (
    <div className="App">
      <h1>📝 MERN Todo App</h1>
      <form onSubmit={handleAdd}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.task}
            <button onClick={() => handleToggle(todo)}>
              {todo.completed ? "Undo" : "Done"}
            </button>
            <button onClick={() => handleDelete(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
