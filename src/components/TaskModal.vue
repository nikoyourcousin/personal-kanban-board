<template>
  <!-- <div class="modal-overlay" @click.self="closeModal"> -->
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h3>{{ isEditing ? 'Edit Task' : 'Task Details' }}</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <!-- View Mode -->
        <template v-if="!isEditing">
          <div class="detail-section">
            <label>Title</label>
            <p class="title-text">{{ task.title }}</p>
          </div>

          <div class="detail-section">
            <label>Description</label>
            <p class="desc-text">{{ task.description || 'No description provided' }}</p>
          </div>

          <div class="detail-row">
            <div class="detail-section">
              <label>Priority</label>
              <div class="priority-badge-view" :class="`priority-${task.priority}`">
                {{ getPriorityLabel(task.priority) }}
              </div>
            </div>
            <div class="detail-section">
              <label>Due Date</label>
              <p :class="{ 'overdue-text': isOverdue && task.column !== 'done' }">
                {{ formatDate(task.dueDate) || 'Not set' }}
              </p>
            </div>
          </div>

          <div class="detail-section">
            <label>Tags</label>
            <div class="tags-view">
              <span v-for="tag in task.tags" :key="tag" class="tag-badge-view">
                {{ tag }}
              </span>
              <span v-if="!task.tags || !task.tags.length" class="empty-text">No tags</span>
            </div>
          </div>

          <div class="detail-section">
            <label>Checklist</label>
            <div class="checklist-view">
              <div v-for="item in localChecklist" :key="item.id" class="checklist-item-view">
                <label class="checkbox-container" @click.stop>
                  <input 
                    type="checkbox" 
                    :checked="item.completed"
                    @change="toggleChecklistItem(item.id)"
                  />
                  <span class="checkmark"></span>
                  <span :class="{ completed: item.completed }">{{ item.text }}</span>
                </label>
              </div>
              <div v-if="!task.checklist || !task.checklist.length" class="empty-text">
                No checklist items
              </div>
              <div v-if="task.checklist && task.checklist.length" class="checklist-stats">
                <span class="stats-text">{{ localCompletedCount }}/{{ task.checklist.length }} completed</span>
                <div class="stats-bar">
                  <div class="stats-fill" :style="{ width: (localCompletedCount / task.checklist.length) * 100 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="metadata">
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Created: {{ formatFullDate(task.createdAt) }}</span>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Updated: {{ formatFullDate(task.updatedAt) }}</span>
            </div>
          </div>
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <div class="input-group">
            <label>Title *</label>
            <input v-model="editedTask.title" type="text" placeholder="Task title" />
          </div>

          <div class="input-group">
            <label>Description</label>
            <textarea v-model="editedTask.description" rows="4" placeholder="Detailed description..."></textarea>
          </div>

          <div class="row-2cols">
            <div class="input-group">
              <label>Priority</label>
              <select v-model="editedTask.priority">
                <option value="high">High - Urgent, do today</option>
                <option value="medium">Medium - Important, this week</option>
                <option value="low">Low - Can wait, nice to have</option>
              </select>
            </div>
            <div class="input-group">
              <label>Due Date</label>
              <input v-model="editedTask.dueDate" type="date" />
            </div>
          </div>

          <!-- Tags - точно как в AddTaskModal -->
          <div class="input-group">
            <label>Tags</label>
            <div class="tags-wrapper">
              <div class="tags-list">
                <span v-for="tag in editedTask.tags" :key="tag" class="tag-badge">
                  {{ tag }}
                  <button @click="removeTag(tag)" class="tag-badge-remove">×</button>
                </span>
                <input 
                  v-model="newTagInput"
                  @keyup.enter="addTag"
                  type="text"
                  class="tag-input"
                  placeholder="Add tag..."
                />
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>Checklist</label>
            <div class="checklist-edit">
              <div v-for="item in editedTask.checklist" :key="item.id" class="checklist-item-edit">
                <input type="checkbox" v-model="item.completed" />
                <input v-model="item.text" type="text" placeholder="Sub-task item" />
                <button @click="removeChecklistItem(item.id)" class="remove-btn">×</button>
              </div>
              <div class="add-checklist">
                <input v-model="newChecklistItem" @keyup.enter="addChecklistItem" type="text" placeholder="Add sub-task..." />
                <button @click="addChecklistItem" class="add-btn">Add</button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="modal-footer">
        <template v-if="!isEditing">
          <button class="btn-edit" @click="startEditing">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3l4 4-7 7H10v-4l7-7z"/>
              <path d="M4 20h16"/>
            </svg>
            Edit Task
          </button>
          <button class="btn-delete" @click="emitDelete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
          </button>
        </template>
        <template v-else>
          <button class="btn-cancel" @click="cancelEditing">Cancel</button>
          <button class="btn-save" @click="saveTask" :disabled="!editedTask.title.trim()">Save Changes</button>
        </template>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="delete-modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal-card">
        <div class="modal-card-header">
          <div class="modal-icon error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3>Delete Task</h3>
          <button class="modal-close" @click="showDeleteConfirm = false">×</button>
        </div>
        <div class="modal-card-body">
          <p>Are you sure you want to delete "{{ task.title }}"?</p>
        </div>
        <div class="modal-card-footer">
          <button class="btn-secondary" @click="showDeleteConfirm = false">Cancel</button>
          <button class="btn-danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update', 'delete'])
const kanbanStore = useKanbanStore()

const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const newTagInput = ref('')
const newChecklistItem = ref('')

// Локальная копия чеклиста для реактивного обновления без закрытия модалки
const localChecklist = ref([...props.task.checklist.map(item => ({ ...item }))])

// Следим за обновлением пропса task
watch(() => props.task, (newTask) => {
  if (newTask && newTask.checklist) {
    localChecklist.value = newTask.checklist.map(item => ({ ...item }))
  }
}, { deep: true })

const localCompletedCount = computed(() => {
  if (!localChecklist.value) return 0
  return localChecklist.value.filter(item => item.completed).length
})

const editedTask = reactive({
  title: props.task.title,
  description: props.task.description || '',
  priority: props.task.priority,
  dueDate: props.task.dueDate || '',
  tags: [...(props.task.tags || [])],
  checklist: [...(props.task.checklist || [])].map(item => ({ ...item }))
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  return new Date(props.task.dueDate) < new Date() && props.task.column !== 'done'
})

const getPriorityLabel = (priority) => {
  const labels = { high: 'High', medium: 'Medium', low: 'Low' }
  return labels[priority] || 'Medium'
}

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatFullDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Toggle checklist item without closing modal
const toggleChecklistItem = (itemId) => {
  // Обновляем локальную копию для мгновенного UI отклика
  const localItem = localChecklist.value.find(i => i.id === itemId)
  if (localItem) {
    localItem.completed = !localItem.completed
  }
  
  // Обновляем в store
  const task = kanbanStore.tasks.find(t => t.id === props.task.id)
  if (task) {
    const item = task.checklist.find(i => i.id === itemId)
    if (item) {
      item.completed = !item.completed
      kanbanStore.saveToStorage()
    }
  }
}

const startEditing = () => {
  isEditing.value = true
  newTagInput.value = ''
}

const cancelEditing = () => {
  isEditing.value = false
  newTagInput.value = ''
  Object.assign(editedTask, {
    title: props.task.title,
    description: props.task.description || '',
    priority: props.task.priority,
    dueDate: props.task.dueDate || '',
    tags: [...(props.task.tags || [])],
    checklist: [...(props.task.checklist || [])].map(item => ({ ...item }))
  })
}

// Добавление тега (как в AddTaskModal)
const addTag = () => {
  const tag = newTagInput.value.trim()
  if (tag && !editedTask.tags.includes(tag)) {
    editedTask.tags.push(tag)
    newTagInput.value = ''
  }
}

// Удаление тега
const removeTag = (tag) => {
  const index = editedTask.tags.indexOf(tag)
  if (index !== -1) {
    editedTask.tags.splice(index, 1)
  }
}

const saveTask = () => {
  if (!editedTask.title.trim()) return
  emit('update', {
    title: editedTask.title.trim(),
    description: editedTask.description,
    priority: editedTask.priority,
    dueDate: editedTask.dueDate,
    tags: editedTask.tags,
    checklist: editedTask.checklist
  })
  isEditing.value = false
  // Обновляем локальную копию после сохранения
  localChecklist.value = editedTask.checklist.map(item => ({ ...item }))
}

const addChecklistItem = () => {
  if (newChecklistItem.value.trim()) {
    editedTask.checklist.push({
      id: Date.now(),
      text: newChecklistItem.value.trim(),
      completed: false
    })
    newChecklistItem.value = ''
  }
}

const removeChecklistItem = (itemId) => {
  const index = editedTask.checklist.findIndex(i => i.id === itemId)
  if (index !== -1) {
    editedTask.checklist.splice(index, 1)
  }
}

const emitDelete = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  emit('delete')
  showDeleteConfirm.value = false
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
  max-width: 580px;
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

/* View Mode */
.detail-section {
  margin-bottom: 20px;
}

.detail-section label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.title-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.desc-text {
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.priority-badge-view {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge-view.priority-high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.priority-badge-view.priority-medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-badge-view.priority-low {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.overdue-text {
  color: #ef4444;
}

/* Tags в режиме просмотра */
.tags-view {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-badge-view {
  display: inline-block;
  padding: 4px 12px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Interactive Checklist Styles */
.checklist-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checklist-item-view {
  display: flex;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  padding-left: 28px;
  user-select: none;
  width: 100%;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 18px;
  width: 18px;
  background: var(--bg-primary);
  border: 2px solid var(--border);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--btn-primary);
  background: rgba(102, 126, 234, 0.05);
}

.checkbox-container input:checked ~ .checkmark {
  background: var(--gradient-primary);
  border-color: var(--btn-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checklist-item-view span:last-child {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.checklist-item-view span.completed {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.checklist-stats {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.stats-text {
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 8px;
}

.stats-bar {
  height: 4px;
  background: var(--bg-column);
  border-radius: 4px;
  overflow: hidden;
}

.stats-fill {
  height: 100%;
  background: var(--gradient-success);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 13px;
}

.metadata {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* Edit Mode */
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

.input-group input, .input-group textarea, .input-group select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input-group input:focus, .input-group textarea:focus, .input-group select:focus {
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

/* Tags wrapper - точно как в AddTaskModal */
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

.tag-input {
  flex: 1;
  padding: 6px 10px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--text-primary);
  min-width: 100px;
}

.tag-input::placeholder {
  color: var(--text-secondary);
}

.checklist-edit {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checklist-item-edit {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checklist-item-edit input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checklist-item-edit input[type="text"] {
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
}

.btn-edit, .btn-delete, .btn-cancel, .btn-save {
  padding: 8px 20px;
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

.btn-edit {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-edit:hover {
  background: var(--hover-bg);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: var(--btn-danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-cancel:hover {
  background: var(--hover-bg);
}

.btn-save {
  background: var(--gradient-primary);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Delete Modal */
.delete-modal-overlay {
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
  z-index: 1100;
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
}

.modal-card-header {
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
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.modal-icon.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--btn-danger);
}

.modal-card-header h3 {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0 8px;
  border-radius: 8px;
}

.modal-close:hover {
  background: var(--hover-bg);
}

.modal-card-body {
  padding: 24px;
}

.modal-card-body p {
  margin: 0;
  color: var(--text-secondary);
}

.modal-card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border);
}

.btn-secondary {
  padding: 8px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.btn-danger {
  padding: 8px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: var(--gradient-danger);
  color: white;
  border: none;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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
  
  .detail-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .row-2cols {
    grid-template-columns: 1fr;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 16px 20px;
  }
}
</style>