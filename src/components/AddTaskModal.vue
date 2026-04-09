<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-icon">
          <Plus :size="24" />
        </div>
        <h3 class="modal-title">Add New Task</h3>
        <button class="modal-close" @click="closeModal">
          <X :size="20" />
        </button>
      </div>
      
      <div class="modal-body">
        <label class="form-label">Task Description</label>
        <textarea
          ref="taskInput"
          v-model="taskText"
          placeholder="Enter task description..."
          class="form-textarea"
          rows="4"
          @keyup.ctrl.enter="addTask"
          @keyup.meta.enter="addTask"
        ></textarea>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModal" class="modal-btn modal-btn-cancel">
          Cancel
        </button>
        <button 
          @click="addTask" 
          class="modal-btn modal-btn-primary"
          :disabled="!taskText.trim()"
        >
          Add Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, X } from 'lucide-vue-next'

const emit = defineEmits(['close', 'add'])
const taskText = ref('')
const taskInput = ref(null)

onMounted(() => {
  if (taskInput.value) {
    taskInput.value.focus()
  }
})

const addTask = () => {
  if (taskText.value.trim()) {
    emit('add', taskText.value)
    taskText.value = ''
    emit('close')
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-primary);
}

.modal-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.modal-close:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--btn-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border);
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
}

.modal-btn-cancel {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.modal-btn-cancel:hover {
  background-color: var(--hover-bg);
}

.modal-btn-primary {
  background-color: var(--btn-primary);
  color: white;
}

.modal-btn-primary:hover:not(:disabled) {
  background-color: var(--btn-primary-hover);
  transform: translateY(-1px);
}

.modal-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  .modal-container {
    width: 95%;
    margin: 16px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 12px 20px;
  }
}
</style>