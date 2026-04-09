<template>
  <div 
    class="kanban-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="column-header">
      <div class="column-title">
        <component :is="columnIcon" :size="18" />
        <h2>{{ title }}</h2>
      </div>
      <span class="task-count">{{ taskCount }}</span>
    </div>
    
    <div class="tasks-container">
      <TransitionGroup name="card" tag="div" class="tasks-list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @delete="handleDelete"
          @update="handleUpdate"
        />
      </TransitionGroup>
      
      <div v-if="tasks.length === 0" class="empty-column">
        <Inbox :size="32" />
        <p>No tasks</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'
import TaskCard from './TaskCard.vue'
import { ClipboardList, Loader2, CheckCircle2, Inbox } from 'lucide-vue-next'

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

const emit = defineEmits(['task-drop'])
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

// Drag-and-Drop handlers
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

const handleUpdate = ({ id, newText }) => {
  kanbanStore.updateTaskText(id, newText)
}
</script>

<style scoped>
.kanban-column {
  background-color: var(--bg-column);
  border-radius: 12px;
  padding: 16px;
  min-height: 500px;
  transition: var(--transition);
  border: 1px solid var(--border);
}

.kanban-column.drag-over {
  background-color: var(--drag-over);
  border-color: var(--btn-primary);
  transform: scale(1.01);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border);
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-title h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.task-count {
  background-color: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.tasks-container {
  min-height: 400px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-column {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-column p {
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .kanban-column {
    min-height: 300px;
  }
  
  .tasks-container {
    min-height: 200px;
  }
}
</style>