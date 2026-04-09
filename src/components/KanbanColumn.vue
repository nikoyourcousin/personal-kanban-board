<template>
  <div 
    class="kanban-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="column-header">
      <div class="column-title-wrapper">
        <div class="column-icon" :class="`icon-${columnId}`">
          <component :is="columnIcon" :size="18" />
        </div>
        <h2>{{ title }}</h2>
      </div>
      <div class="task-counter">{{ taskCount }}</div>
    </div>
    
    <div class="tasks-container">
      <TransitionGroup name="card" tag="div" class="tasks-list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @delete="handleDelete"
          @update="handleUpdate"
          @open-modal="handleOpenModal"
        />
      </TransitionGroup>
      
      <div v-if="tasks.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <p>No tasks yet</p>
        <span>Drag or add new tasks</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'
import TaskCard from './TaskCard.vue'
import { ClipboardList, Loader2, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  columnId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  taskCount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['task-drop', 'open-modal'])
const kanbanStore = useKanbanStore()
const isDragOver = ref(false)

const columnIcon = computed(() => {
  const icons = {
    todo: ClipboardList,
    progress: Loader2,
    done: CheckCircle2
  }
  return icons[props.columnId] || ClipboardList
})

const onDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event) => {
  isDragOver.value = false
  const taskId = parseInt(event.dataTransfer.getData('text/plain'))
  if (taskId && !isNaN(taskId)) {
    emit('task-drop', {
      taskId: taskId,
      targetColumn: props.columnId
    })
  }
}

const handleDelete = (taskId) => {
  kanbanStore.deleteTask(taskId)
}

const handleUpdate = ({ id, ...data }) => {
  kanbanStore.updateTask(id, data)
}

const handleOpenModal = (task) => {
  emit('open-modal', task)
}
</script>

<style scoped>
.kanban-column {
  background: var(--bg-column);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-height: 400px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
}

.kanban-column.drag-over {
  background: var(--drag-over);
  border-color: var(--btn-primary);
  transform: scale(1.01);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
  flex-shrink: 0;
}

.column-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.column-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.1);
}

.icon-todo {
  color: #667eea;
}
.icon-progress {
  color: #f093fb;
}
.icon-done {
  color: #4facfe;
}

.column-title-wrapper h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.task-counter {
  background: var(--gradient-primary);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.tasks-container {
  flex: 1;
  min-height: 300px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state p {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
}

.empty-state span {
  font-size: 12px;
  opacity: 0.7;
}

/* Анимация для карточек без влияния на высоту колонки */
.card-move,
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.card-leave-to {
  opacity: 0;
  transform: translateX(-30px);
  position: absolute;
  width: calc(100% - 40px);
}

.card-leave-active {
  position: absolute;
  width: calc(100% - 40px);
}

.tasks-list {
  position: relative;
}
</style>