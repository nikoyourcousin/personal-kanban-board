import { defineStore } from 'pinia'

const STORAGE_KEY = 'kanban-tasks'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: ['todo', 'progress', 'done'],
    columnNames: {
      todo: 'To Do',
      progress: 'In Progress',
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
          text: 'Review project requirements', 
          column: 'todo', 
          createdAt: Date.now() - 86400000 
        },
        { 
          id: Date.now() + 2, 
          text: 'Design system architecture', 
          column: 'progress', 
          createdAt: Date.now() - 43200000 
        },
        { 
          id: Date.now() + 3, 
          text: 'Implement drag and drop', 
          column: 'done', 
          createdAt: Date.now() - 21600000 
        },
        { 
          id: Date.now() + 4, 
          text: 'Write documentation', 
          column: 'todo', 
          createdAt: Date.now() - 10800000 
        }
      ]
      this.saveToStorage()
    },
    
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
    },
    
    addTask(text) {
      if (!text || !text.trim()) return
      
      const newTask = {
        id: Date.now(),
        text: text.trim(),
        column: 'todo',
        createdAt: Date.now()
      }
      this.tasks.push(newTask)
      this.saveToStorage()
    },
    
    deleteTask(id) {
      const index = this.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
        this.saveToStorage()
      }
    },
    
    updateTaskText(id, newText) {
      const task = this.tasks.find(task => task.id === id)
      if (task && newText && newText.trim()) {
        task.text = newText.trim()
        this.saveToStorage()
      }
    },
    
    moveTask(taskId, targetColumn) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task && task.column !== targetColumn) {
        task.column = targetColumn
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
      return state.tasks
        .filter(task => task.column === column)
        .sort((a, b) => b.createdAt - a.createdAt)
    }
  }
})