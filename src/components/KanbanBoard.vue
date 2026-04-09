<template>
  <div class="kanban-board">
    <div class="board-header">
      <button @click="showAddModal = true" class="add-task-btn">
        <Plus :size="16" />
        <span>Add Task</span>
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
      />
    </div>
    
    <AddTaskModal 
      v-if="showAddModal" 
      @close="showAddModal = false"
      @add="handleAddTask"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'
import KanbanColumn from './KanbanColumn.vue'
import AddTaskModal from './AddTaskModal.vue'
import { Plus } from 'lucide-vue-next'

const kanbanStore = useKanbanStore()
const showAddModal = ref(false)

const handleAddTask = (taskText) => {
  if (taskText && taskText.trim()) {
    kanbanStore.addTask(taskText)
  }
}

const handleTaskDrop = (event) => {
  const { taskId, targetColumn } = event
  kanbanStore.moveTask(taskId, targetColumn)
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
  background-color: var(--btn-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.add-task-btn:hover {
  background-color: var(--btn-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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