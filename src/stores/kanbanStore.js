import { defineStore } from 'pinia'

const STORAGE_KEY = 'kanban-tasks'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: ['todo', 'progress', 'blocked', 'done'],
    columnNames: {
      todo: 'To Do',
      progress: 'In Progress',
      blocked: 'Blocked',
      done: 'Done'
    },
    tasks: []
  }),
  
  actions: {
    loadFromStorage() {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          this.tasks = JSON.parse(saved)
        } catch (e) {
          console.error('Error loading data:', e)
          this.initDefaultTasks()
        }
      } else {
        this.initDefaultTasks()
      }
    },
    
    initDefaultTasks() {
      this.tasks = [
        { 
          id: Date.now() + 1,
          title: 'Complete project proposal',
          description: 'Write and review the Q1 project proposal for client meeting',
          column: 'todo',
          priority: 'high',
          dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          tags: ['work', 'urgent'],
          checklist: [
            { id: Date.now() + 100, text: 'Research market trends', completed: false },
            { id: Date.now() + 101, text: 'Draft proposal outline', completed: true },
            { id: Date.now() + 102, text: 'Review with team', completed: false }
          ],
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now() - 43200000
        },
        { 
          id: Date.now() + 2,
          title: 'Learn Vue 3 Composition API',
          description: 'Study the new composition API and script setup syntax',
          column: 'progress',
          priority: 'medium',
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          tags: ['learning', 'vue'],
          checklist: [
            { id: Date.now() + 200, text: 'Watch tutorial videos', completed: true },
            { id: Date.now() + 201, text: 'Build practice app', completed: false }
          ],
          createdAt: Date.now() - 43200000,
          updatedAt: Date.now() - 21600000
        },
        { 
          id: Date.now() + 3,
          title: 'Setup project infrastructure',
          description: 'Configure Vite, Pinia, and project structure',
          column: 'done',
          priority: 'high',
          dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
          tags: ['setup', 'infrastructure'],
          checklist: [
            { id: Date.now() + 300, text: 'Initialize Vite project', completed: true },
            { id: Date.now() + 301, text: 'Install dependencies', completed: true },
            { id: Date.now() + 302, text: 'Configure project structure', completed: true }
          ],
          createdAt: Date.now() - 21600000,
          updatedAt: Date.now() - 10800000
        }
      ]
      this.saveToStorage()
    },
    
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
    },
    
    addTask(taskData) {
      if (!taskData.title || !taskData.title.trim()) return
      
      const newTask = {
        id: Date.now(),
        title: taskData.title.trim(),
        description: taskData.description || '',
        column: 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || '',
        tags: taskData.tags || [],
        checklist: taskData.checklist || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      this.tasks.push(newTask)
      this.saveToStorage()
    },
    
    updateTask(id, updatedData) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        Object.assign(task, updatedData, { updatedAt: Date.now() })
        this.saveToStorage()
      }
    },
    
    deleteTask(id) {
      const index = this.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
        this.saveToStorage()
      }
    },
    
    moveTask(taskId, targetColumn) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task && task.column !== targetColumn) {
        task.column = targetColumn
        task.updatedAt = Date.now()
        this.saveToStorage()
      }
    },
    
    clearAllTasks() {
      this.tasks = []
      this.saveToStorage()
    },
    
    importData(tasks) {
      if (Array.isArray(tasks)) {
        this.tasks = tasks
        this.saveToStorage()
      }
    },
    
    getTasksByColumn(column) {
      return this.tasks.filter(task => task.column === column)
    },
    
    getTaskCount(column) {
      return this.tasks.filter(task => task.column === column).length
    }
  },
  
  getters: {
    getTasksByColumnSorted: (state) => (column) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return state.tasks
        .filter(task => task.column === column)
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          }
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate)
          }
          return b.createdAt - a.createdAt
        })
    }
  }
})