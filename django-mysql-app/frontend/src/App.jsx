import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [articles, setArticles] = useState([])
  const [newArticle, setNewArticle] = useState({ title: '', content: '', author: '' })
  const [status, setStatus] = useState({ message: '', type: '' })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    checkBackend()
    loadArticles()
  }, [])

  const checkBackend = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setStatus({ message: data.status, type: 'success' })
    } catch (err) {
      setStatus({ message: 'Backend connection failed', type: 'error' })
    }
  }

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles/')
      const data = await res.json()
      setArticles(data)
    } catch (err) {
      console.error(err)
    }
  }

  const addArticle = async (e) => {
    e.preventDefault()
    if (!newArticle.title || !newArticle.author) return

    try {
      await fetch('/api/articles/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      })
      setNewArticle({ title: '', content: '', author: '' })
      loadArticles()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteArticle = async (id) => {
    try {
      await fetch(`/api/articles/${id}/`, { method: 'DELETE' })
      loadArticles()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>📰 Blog Platform</h1>
        <p className="subtitle">Django + MySQL + React</p>
        
        <div className={`status ${status.type}`}>{status.message}</div>

        <form onSubmit={addArticle} className="add-form">
          <input
            value={newArticle.title}
            onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
            placeholder="Article title"
            required
          />
          <textarea
            value={newArticle.content}
            onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
            placeholder="Article content"
            rows="4"
          />
          <input
            value={newArticle.author}
            onChange={(e) => setNewArticle({...newArticle, author: e.target.value})}
            placeholder="Author name"
            required
          />
          <button type="submit">Publish Article</button>
        </form>

        <div className="articles">
          {articles.map(article => (
            <div key={article.id} className="article-card">
              <h2>{article.title}</h2>
              <p className="meta">By {article.author} • {new Date(article.created_at).toLocaleDateString()}</p>
              <p className="content">{article.content}</p>
              <button onClick={() => deleteArticle(article.id)} className="delete-btn">Delete</button>
            </div>
          ))}
          {articles.length === 0 && <div className="empty">No articles yet!</div>}
        </div>
      </div>
    </div>
  )
}

export default App