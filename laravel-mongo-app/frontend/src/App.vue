<template>
  <div class="app">
    <div class="container">
      <h1>📝 Task Manager</h1>
      <p class="subtitle">Laravel + MongoDB + Vue.js</p>
      
      <div :class="['status', statusClass]">{{ statusMessage }}</div>

      <div class="add-task">
        <input v-model="newTask.title" placeholder="Task title" @keyup.enter="addTask">
        <input v-model="newTask.description" placeholder="Description" @keyup.enter="addTask">
        <button @click="addTask">Add Task</button>
      </div>

      <div class="tasks">
        <div v-for="task in tasks" :key="task._id" :class="['task-card', { completed: task.completed }]">
          <div class="task-content">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
          </div>
          <div class="task-actions">
            <button @click="toggleTask(task._id)" class="toggle-btn">
              {{ task.completed ? '↩️ Undo' : '✓ Complete' }}
            </button>
            <button @click="deleteTask(task._id)" class="delete-btn">Delete</button>
          </div>
        </div>
        <div v-if="tasks.length === 0" class="empty">No tasks yet!</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [],
      newTask: { title: '', description: '' },
      statusMessage: '',
      statusClass: ''
    }
  },
  mounted() {
    this.checkBackend()
    this.loadTasks()
  },
  methods: {
    async checkBackend() {
      try {
        const res = await fetch('/api/health')
        const data = await res.json()
        this.statusMessage = data.status
        this.statusClass = 'success'
      } catch (err) {
        this.statusMessage = 'Backend connection failed'
        this.statusClass = 'error'
      }
    },
    async loadTasks() {
      try {
        const res = await fetch('/api/tasks')
        this.tasks = await res.json()
      } catch (err) {
        console.error(err)
      }
    },
    async addTask() {
      if (!this.newTask.title) return
      try {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newTask)
        })
        this.newTask = { title: '', description: '' }
        this.loadTasks()
      } catch (err) {
        console.error(err)
      }
    },
    async toggleTask(id) {
      try {
        await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' })
        this.loadTasks()
      } catch (err) {
        console.error(err)
      }
    },
    async deleteTask(id) {
      try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        this.loadTasks()
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.app {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
  padding: 20px;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 30px;
}
h1 { color: #f5576c; text-align: center; }
.subtitle { text-align: center; color: #666; margin-bottom: 20px; }
.status { padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: bold; }
.status.success { background: #d4edda; color: #155724; }
.status.error { background: #f8d7da; color: #721c24; }
.add-task { display: flex; gap: 10px; margin: 20px 0; }
.add-task input { flex: 1; padding: 12px; border: 2px solid #ddd; border-radius: 8px; }
.add-task button { padding: 12px 24px; background: #f5576c; color: white; border: none; border-radius: 8px; cursor: pointer; }
.tasks { display: grid; gap: 15px; }
.task-card { padding: 15px; background: #f8f9fa; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
.task-card.completed { opacity: 0.6; }
.task-card.completed h3 { text-decoration: line-through; }
.task-content h3 { margin-bottom: 5px; }
.task-content p { color: #666; font-size: 14px; }
.task-actions { display: flex; gap: 10px; }
button { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
.toggle-btn { background: #28a745; color: white; }
.delete-btn { background: #dc3545; color: white; }
.empty { text-align: center; color: #999; padding: 40px; }
</style>