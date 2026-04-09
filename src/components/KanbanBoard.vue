<template>
  <div class="kanban-board">
    <div class="board-header">
      <button class="add-task-btn" @click="showAddModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Task
      </button>
    </div>
    
    <div class="columns-container">
      <KanbanColumn
        v-for="column in kanbanStore.columns"
        :key="column"
        :column-id="column"
        :title="kanbanStore.columnNames[column]"
        :tasks="kanbanStore.getTasksByColumnSorted(column)"
        :task-count="kanbanStore.getTaskCount(column)"
        @task-drop="handleTaskDrop"
        @open-modal="handleOpenModal"
      />
    </div>
    
    <AddTaskModal 
      v-if="showAddModal" 
      @close="showAddModal = false"
      @add="handleAddTask"
    />

    <TaskModal
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @update="handleUpdateTask"
      @delete="handleDeleteTask"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'
import KanbanColumn from './KanbanColumn.vue'
import AddTaskModal from './AddTaskModal.vue'
import TaskModal from './TaskModal.vue'

const kanbanStore = useKanbanStore()
const showAddModal = ref(false)
const selectedTask = ref(null)

const handleAddTask = (taskData) => {
  kanbanStore.addTask(taskData)
}

const handleTaskDrop = (event) => {
  const { taskId, targetColumn } = event
  kanbanStore.moveTask(taskId, targetColumn)
}

const handleOpenModal = (task) => {
  selectedTask.value = task
}

const handleUpdateTask = (updatedData) => {
  kanbanStore.updateTask(selectedTask.value.id, updatedData)
  selectedTask.value = null
}

const handleDeleteTask = (taskId) => {
  kanbanStore.deleteTask(taskId)
  selectedTask.value = null
}
</script>

<style scoped>
.kanban-board {
  max-width: 1400px;
  margin: 0 auto;
}

.board-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.add-task-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.add-task-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.add-task-btn:hover::before {
  width: 300px;
  height: 300px;
}

.add-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.columns-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  align-items: start;
}

@media (max-width: 768px) {
  .columns-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .add-task-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>