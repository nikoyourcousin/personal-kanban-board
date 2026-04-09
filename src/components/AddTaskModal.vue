<template>
  <!-- <div class="modal-overlay" @click.self="closeModal"> -->
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <h3>Create New Task</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <div class="input-group">
          <label>Task Title *</label>
          <input 
            ref="titleInput"
            v-model="form.title" 
            type="text" 
            placeholder="Enter task title..."
          />
        </div>

        <div class="input-group">
          <label>Description</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            placeholder="Write a detailed description..."
          ></textarea>
        </div>

        <div class="row-2cols">
          <div class="input-group">
            <label>Priority</label>
            <div class="priority-selector">
              <button 
                v-for="p in priorities" 
                :key="p.value"
                class="priority-opt"
                :class="{ active: form.priority === p.value, [p.value]: true }"
                @click="form.priority = p.value"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>Due Date</label>
            <input 
              v-model="form.dueDate" 
              type="date"
            />
          </div>
        </div>

        <div class="input-group">
          <label>Tags</label>
          <div class="tags-wrapper">
            <div class="tags-list">
              <!-- Цветные бейджи как в TaskModal -->
              <span v-for="tag in form.tags" :key="tag" class="tag-badge">
                {{ tag }}
                <button @click="removeTag(tag)" class="tag-badge-remove">×</button>
              </span>
              <input 
                v-model="tagInput"
                @keyup.enter="addTag"
                type="text"
                placeholder="Add tag..."
              />
            </div>
          </div>
        </div>

        <div class="input-group">
          <label>Checklist</label>
          <div class="checklist-editor">
            <div v-for="(item, index) in form.checklist" :key="index" class="checklist-item">
              <input type="checkbox" disabled />
              <input 
                v-model="item.text" 
                type="text" 
                placeholder="Sub-task item"
              />
              <button @click="removeChecklistItem(index)" class="remove-btn">×</button>
            </div>
            <div class="add-checklist">
              <input 
                v-model="newChecklistItem"
                @keyup.enter="addChecklistItem"
                type="text"
                placeholder="Add sub-task..."
              />
              <button @click="addChecklistItem" class="add-btn">Add</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">Cancel</button>
        <button class="btn-submit" @click="addTask" :disabled="!form.title.trim()">
          Create Task
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const emit = defineEmits(['close', 'add'])

const titleInput = ref(null)
const tagInput = ref('')
const newChecklistItem = ref('')

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: [],
  checklist: []
})

const priorities = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

onMounted(() => {
  if (titleInput.value) {
    titleInput.value.focus()
  }
})

const addTag = () => {
  if (tagInput.value.trim() && !form.tags.includes(tagInput.value.trim())) {
    form.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  const index = form.tags.indexOf(tag)
  if (index !== -1) {
    form.tags.splice(index, 1)
  }
}

const addChecklistItem = () => {
  if (newChecklistItem.value.trim()) {
    form.checklist.push({ text: newChecklistItem.value.trim() })
    newChecklistItem.value = ''
  }
}

const removeChecklistItem = (index) => {
  form.checklist.splice(index, 1)
}

const addTask = () => {
  if (!form.title.trim()) return
  
  const checklistWithIds = form.checklist.map(item => ({
    id: Date.now() + Math.random(),
    text: item.text,
    completed: false
  }))
  
  emit('add', {
    title: form.title.trim(),
    description: form.description,
    priority: form.priority,
    dueDate: form.dueDate,
    tags: form.tags,
    checklist: checklistWithIds
  })
  
  closeModal()
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  background: var(--bg-secondary);
  border-radius: 24px;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
  border: 1px solid var(--border);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 1;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--gradient-primary);
  border-radius: 12px;
  color: white;
}

.modal-header h3 {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0 8px;
  border-radius: 8px;
}

.close-btn:hover {
  background: var(--hover-bg);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border);
  position: sticky;
  bottom: 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--text-primary);
}

.input-group input, .input-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input-group input:focus, .input-group textarea:focus {
  outline: none;
  border-color: var(--btn-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.row-2cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.priority-selector {
  display: flex;
  gap: 8px;
}

.priority-opt {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-primary);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  color: var(--text-primary);
}

.priority-opt.high.active {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #ef4444;
}

.priority-opt.medium.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #f59e0b;
}

.priority-opt.low.active {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
}

/* Tags wrapper - одинаковые цветные бейджи как в TaskModal */
.tags-wrapper {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 8px;
  background: var(--bg-primary);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.tag-badge-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: white;
  padding: 0 2px;
  margin-left: 2px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tag-badge-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tags-list input {
  flex: 1;
  padding: 6px 10px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--text-primary);
  min-width: 100px;
}

.checklist-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checklist-item input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.remove-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0 4px;
}

.add-checklist {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.add-checklist input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.add-btn {
  padding: 8px 16px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-cancel, .btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-submit {
  background: var(--gradient-primary);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-cancel:hover {
  background: var(--hover-bg);
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

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
  }
  
  .row-2cols {
    grid-template-columns: 1fr;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 16px 20px;
  }
}
</style>