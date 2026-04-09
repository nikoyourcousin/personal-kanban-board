<template>
  <div class="app">
    <header class="app-header">
      <div class="header-left">
        <LayoutGrid class="logo-icon" :size="24" />
        <h1>Kanban Board</h1>
      </div>
      <div class="header-actions">
        <button @click="exportData" class="btn btn-secondary" title="Export data">
          <Download :size="16" />
          <span>Export</span>
        </button>
        <button @click="importData" class="btn btn-secondary" title="Import data">
          <Upload :size="16" />
          <span>Import</span>
        </button>
        <button @click="showClearModal = true" class="btn btn-danger" title="Clear all">
          <Trash2 :size="16" />
          <span>Clear All</span>
        </button>
        <button @click="toggleTheme" class="btn theme-toggle">
          <Sun v-if="isDarkMode" :size="18" />
          <Moon v-else :size="18" />
        </button>
      </div>
    </header>
    <KanbanBoard />
    
    <!-- Hidden file input for import -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".json" 
      style="display: none" 
      @change="handleFileImport"
    />

    <!-- Clear All Confirmation Modal -->
    <Modal
      v-if="showClearModal"
      title="Clear All Tasks"
      description="Are you sure you want to delete all tasks? This action cannot be undone."
      confirm-text="Clear All"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmClearAll"
      @close="showClearModal = false"
    />

    <!-- Import Success Modal -->
    <Modal
      v-if="showImportModal"
      title="Import Successful"
      description="Data has been imported successfully."
      confirm-text="OK"
      :show-cancel="false"
      type="success"
      @confirm="showImportModal = false"
      @close="showImportModal = false"
    />

    <!-- Import Error Modal -->
    <Modal
      v-if="showImportErrorModal"
      title="Import Failed"
      description="Invalid file format or corrupted data. Please check the file and try again."
      confirm-text="OK"
      :show-cancel="false"
      type="error"
      @confirm="showImportErrorModal = false"
      @close="showImportErrorModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useKanbanStore } from './stores/kanbanStore'
import KanbanBoard from './components/KanbanBoard.vue'
import Modal from './components/Modal.vue'
import { LayoutGrid, Download, Upload, Trash2, Sun, Moon } from 'lucide-vue-next'

const kanbanStore = useKanbanStore()
const fileInput = ref(null)
const isDarkMode = ref(false)
const showClearModal = ref(false)
const showImportModal = ref(false)
const showImportErrorModal = ref(false)

// Dark theme toggle
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme', 'light')
  }
}

// Load theme from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

// Export data
const exportData = () => {
  const data = {
    tasks: kanbanStore.tasks,
    columns: kanbanStore.columns,
    exportDate: new Date().toISOString()
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kanban-backup-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Import data
const importData = () => {
  fileInput.value.click()
}

const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.tasks && Array.isArray(data.tasks)) {
        kanbanStore.importData(data.tasks)
        showImportModal.value = true
      } else {
        showImportErrorModal.value = true
      }
    } catch (error) {
      showImportErrorModal.value = true
    }
  }
  reader.readAsText(file)
  fileInput.value.value = ''
}

// Clear all tasks
const confirmClearAll = () => {
  kanbanStore.clearAllTasks()
  showClearModal.value = false
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 24px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: var(--btn-primary);
}

.app-header h1 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--btn-primary);
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: var(--btn-primary-hover);
}

.btn-danger {
  background-color: var(--btn-danger);
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: var(--btn-danger-hover);
}

.theme-toggle {
  padding: 8px 12px;
}

@media (max-width: 768px) {
  .app {
    padding: 16px;
  }
  
  .app-header h1 {
    font-size: 20px;
  }
  
  .btn span {
    display: none;
  }
  
  .btn {
    padding: 8px 12px;
  }
}
</style>