<template>
  <div 
    class="task-card"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="task-content" v-if="!isEditing">
      <div class="task-header">
        <FileText class="task-icon" :size="16" />
        <p class="task-text">{{ task.text }}</p>
      </div>
      <div class="task-footer">
        <div class="task-date">
          <Calendar :size="12" />
          <span>{{ formattedDate }}</span>
        </div>
        <div class="task-actions">
          <button @click="startEdit" class="action-btn edit-btn" title="Edit">
            <Edit2 :size="14" />
          </button>
          <button @click="confirmDelete" class="action-btn delete-btn" title="Delete">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="task-edit">
      <input 
        ref="editInput"
        v-model="editText" 
        type="text" 
        class="edit-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        placeholder="Edit task..."
      />
      <div class="edit-actions">
        <button @click="saveEdit" class="save-btn">Save</button>
        <button @click="cancelEdit" class="cancel-btn">Cancel</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-if="showDeleteModal"
      title="Delete Task"
      :description='`Are you sure you want to delete "${task.text}"?`'
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDeleteTask"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { FileText, Calendar, Edit2, Trash2 } from 'lucide-vue-next'
import Modal from './Modal.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'update'])

const isEditing = ref(false)
const editText = ref('')
const editInput = ref(null)
const showDeleteModal = ref(false)

// Format date
const formattedDate = computed(() => {
  const date = new Date(props.task.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
})

// Drag-and-Drop handlers
const onDragStart = (event) => {
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
  event.target.classList.add('dragging')
}

const onDragEnd = (event) => {
  event.target.classList.remove('dragging')
}

// Edit task
const startEdit = () => {
  editText.value = props.task.text
  isEditing.value = true
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus()
    }
  })
}

const saveEdit = () => {
  if (editText.value.trim() && editText.value !== props.task.text) {
    emit('update', { id: props.task.id, newText: editText.value })
  }
  cancelEdit()
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
}

// Delete with modal confirmation
const confirmDelete = () => {
  showDeleteModal.value = true
}

const confirmDeleteTask = () => {
  emit('delete', props.task.id)
  showDeleteModal.value = false
}
</script>

<style scoped>
.task-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 12px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: grab;
  border: 1px solid var(--border);
}

.task-card:active {
  cursor: grabbing;
}

.task-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--btn-primary);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.task-icon {
  color: var(--text-secondary);
  margin-top: 2px;
  flex-shrink: 0;
}

.task-text {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  color: var(--text-primary);
  flex: 1;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
}

.task-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.action-btn:hover {
  background-color: var(--hover-bg);
}

.edit-btn:hover {
  color: var(--btn-primary);
}

.delete-btn:hover {
  color: var(--btn-danger);
}

.task-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  font-size: 14px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
}

.edit-input:focus {
  outline: none;
  border-color: var(--btn-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.save-btn, .cancel-btn {
  padding: 4px 12px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: var(--transition);
}

.save-btn {
  background-color: var(--success);
  color: white;
}

.save-btn:hover {
  opacity: 0.9;
}

.cancel-btn {
  background-color: var(--bg-column);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.cancel-btn:hover {
  background-color: var(--hover-bg);
}

@media (max-width: 768px) {
  .task-card {
    padding: 10px;
  }
}
</style>