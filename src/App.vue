<template>
  <div class="app">
    <header class="app-header glass">
      <div class="header-left">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </div>
        <h1 class="text-gradient">Kanban Board</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" @click="exportData">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
        <button class="btn btn-outline" @click="importData">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Import
        </button>
        <button class="btn btn-danger-outline" @click="showClearModal = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Clear All
        </button>
        <button class="btn theme-toggle" @click="toggleTheme">
          <svg v-if="isDarkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </header>
    
    <KanbanBoard />
    
    <input ref="fileInput" type="file" accept=".json" style="display: none" @change="handleFileImport" />

    <!-- Clear All Modal -->
    <!-- <div v-if="showClearModal" class="modal-overlay" @click.self="showClearModal = false"> -->
    <div v-if="showClearModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-card-header">
          <div class="modal-icon error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3>Clear All Tasks</h3>
          <button class="modal-close" @click="showClearModal = false">×</button>
        </div>
        <div class="modal-card-body">
          <p>Are you sure you want to delete all tasks? This action cannot be undone.</p>
        </div>
        <div class="modal-card-footer">
          <button class="btn-secondary" @click="showClearModal = false">Cancel</button>
          <button class="btn-danger" @click="confirmClearAll">Clear All</button>
        </div>
      </div>
    </div>

    <!-- Import Success Modal -->
    <!-- <div v-if="showImportModal" class="modal-overlay" @click.self="showImportModal = false"> -->
    <div v-if="showImportModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-card-header">
          <div class="modal-icon success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3>Import Successful</h3>
          <button class="modal-close" @click="showImportModal = false">×</button>
        </div>
        <div class="modal-card-body">
          <p>Data has been imported successfully.</p>
        </div>
        <div class="modal-card-footer">
          <button class="btn-primary" @click="showImportModal = false">OK</button>
        </div>
      </div>
    </div>

    <!-- Import Error Modal -->
    <!-- <div v-if="showImportErrorModal" class="modal-overlay" @click.self="showImportErrorModal = false"> -->
    <div v-if="showImportErrorModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-card-header">
          <div class="modal-icon error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
          <h3>Import Failed</h3>
          <button class="modal-close" @click="showImportErrorModal = false">×</button>
        </div>
        <div class="modal-card-body">
          <p>Invalid file format or corrupted data. Please check the file and try again.</p>
        </div>
        <div class="modal-card-footer">
          <button class="btn-primary" @click="showImportErrorModal = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useKanbanStore } from './stores/kanbanStore'
import KanbanBoard from './components/KanbanBoard.vue'

const kanbanStore = useKanbanStore()
const fileInput = ref(null)
const isDarkMode = ref(false)
const showClearModal = ref(false)
const showImportModal = ref(false)
const showImportErrorModal = ref(false)

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

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  kanbanStore.loadFromStorage()
})

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
  padding: 16px 24px;
  border-radius: 24px;
  background: var(--bg-column);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
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
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  transition: left 0.3s ease;
  z-index: 0;
  opacity: 0.1;
}

.btn:hover::before {
  left: 0;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
}

.btn-outline:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  border-color: var(--btn-primary);
}

.btn-danger-outline {
  background: transparent;
  border: 1px solid rgba(245, 87, 108, 0.5);
  color: var(--btn-danger);
}

.btn-danger-outline:hover {
  background: rgba(245, 87, 108, 0.1);
  transform: translateY(-2px);
  border-color: var(--btn-danger);
}

.theme-toggle {
  padding: 8px 12px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-card {
  background: var(--bg-secondary);
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

.modal-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-primary);
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.modal-icon.error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
  color: var(--btn-danger);
}

.modal-icon.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  color: var(--success);
}

.modal-card-header h3 {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 8px;
  transition: var(--transition);
}

.modal-close:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.modal-card-body {
  padding: 24px;
  background: var(--bg-secondary);
}

.modal-card-body p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border);
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 8px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.btn-danger {
  background: var(--gradient-danger);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .app {
    padding: 16px;
  }
  
  .app-header {
    padding: 12px 16px;
  }
  
  .header-left h1 {
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