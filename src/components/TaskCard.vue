<template>
  <div 
    class="task-card"
    :class="{ dragging: isDragging, [`priority-${task.priority}`]: true }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click.stop="$emit('open-modal', task)"
  >
    <div class="card-content">
      <div class="priority-badge" :class="`badge-${task.priority}`">
        <span class="badge-dot"></span>
        {{ getPriorityLabel(task.priority) }}
      </div>

      <h4 class="task-title">{{ task.title }}</h4>

      <p v-if="task.description" class="task-description">
        {{ truncateText(task.description, 80) }}
      </p>

      <div v-if="task.dueDate" class="due-date" :class="{ overdue: isOverdue }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{{ formatDueDate(task.dueDate) }}</span>
      </div>

      <div v-if="task.tags && task.tags.length" class="tags-container">
        <span v-for="tag in task.tags.slice(0, 3)" :key="tag" class="tag">
          #{{ tag }}
        </span>
        <span v-if="task.tags.length > 3" class="tag-more">+{{ task.tags.length - 3 }}</span>
      </div>

      <div v-if="task.checklist && task.checklist.length" class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: checklistProgress + '%' }"></div>
        </div>
        <span class="progress-text">{{ completedCount }}/{{ task.checklist.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'update', 'open-modal'])
const isDragging = ref(false)

const checklistProgress = computed(() => {
  if (!props.task.checklist || props.task.checklist.length === 0) return 0
  const completed = props.task.checklist.filter(item => item.completed).length
  return (completed / props.task.checklist.length) * 100
})

const completedCount = computed(() => {
  if (!props.task.checklist) return 0
  return props.task.checklist.filter(item => item.completed).length
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  return new Date(props.task.dueDate) < new Date() && props.task.column !== 'done'
})

const getPriorityLabel = (priority) => {
  const labels = { high: 'High', medium: 'Medium', low: 'Low' }
  return labels[priority] || 'Medium'
}

const formatDueDate = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const onDragStart = (event) => {
  isDragging.value = true
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
}

const onDragEnd = () => {
  isDragging.value = false
}
</script>

<style scoped>
.task-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -12px rgba(102, 126, 234, 0.25);
  border-color: var(--btn-primary);
  background: var(--bg-secondary);
}

.task-card.dragging {
  opacity: 0.5;
  transform: scale(0.98);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge-high {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.06));
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-high .badge-dot {
  background: #ef4444;
  box-shadow: 0 0 4px #ef4444;
}

.badge-medium {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.06));
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-medium .badge-dot {
  background: #f59e0b;
  box-shadow: 0 0 4px #f59e0b;
}

.badge-low {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.06));
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-low .badge-dot {
  background: #10b981;
  box-shadow: 0 0 4px #10b981;
}

.task-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.task-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  padding: 4px 0;
}

.due-date.overdue {
  color: #ef4444;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 3px 8px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 12px;
  color: var(--btn-primary);
  font-weight: 500;
}

.tag-more {
  font-size: 11px;
  padding: 3px 8px;
  color: var(--text-secondary);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(100, 116, 139, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-success);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>