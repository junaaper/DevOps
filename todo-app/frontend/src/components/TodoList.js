import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || '';

function TodoList({ token, username, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch(`${API}/api/todos`, { headers })
      .then(r => r.json())
      .then(data => { setTodos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(`${API}/api/todos`, {
      method: 'POST', headers,
      body: JSON.stringify({ text: text.trim() }),
    });
    const todo = await res.json();
    setTodos([todo, ...todos]);
    setText('');
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/api/todos/${id}`, { method: 'PATCH', headers });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/api/todos/${id}`, { method: 'DELETE', headers });
    setTodos(todos.filter(t => t.id !== id));
  };

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const pending = total - done;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="todo-page">
      <header className="todo-header">
        <div className="todo-header-left">
          <span className="brand-icon">✦</span>
          <h1>TodoApp</h1>
        </div>
        <div className="user-info">
          <span className="username-badge">@{username}</span>
          <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
      </header>
      <main className="todo-main">
        <div className="todo-stats">
          <div className="stat"><div className="stat-number">{total}</div><div className="stat-label">Total Tasks</div></div>
          <div className="stat"><div className="stat-number">{pending}</div><div className="stat-label">Pending</div></div>
          <div className="stat"><div className="stat-number">{done}</div><div className="stat-label">Completed</div></div>
        </div>
        <form className="add-todo-form" onSubmit={addTodo}>
          <input type="text" placeholder="Add a new task..." value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" className="btn-add">+</button>
        </form>
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <div>No tasks yet. Add one above.</div>
          </div>
        ) : (
          <>
            <div className="section-label">Tasks — {total} total</div>
            <div className="todo-list">
              {todos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-checkbox" onClick={() => toggleTodo(todo.id)}>
                    {todo.completed && <span className="todo-checkbox-inner">✓</span>}
                  </div>
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-date">{formatDate(todo.created_at)}</span>
                  <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>×</button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default TodoList;
