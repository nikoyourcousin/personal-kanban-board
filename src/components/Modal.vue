<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container" :class="modalTypeClass">
      <div class="modal-header">
        <div class="modal-icon" v-if="icon">
          <component :is="icon" :size="24" />
        </div>
        <h3 class="modal-title">{{ title }}</h3>
        <button class="modal-close" @click="handleClose">
          <X :size="20" />
        </button>
      </div>
      
      <div class="modal-body">
        <p class="modal-description">{{ description }}</p>
      </div>
      
      <div class="modal-footer">
        <button 
          v-if="showCancel" 
          @click="handleClose" 
          class="modal-btn modal-btn-cancel"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="handleConfirm" 
          class="modal-btn" 
          :class="confirmButtonClass"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'info', // 'info', 'danger', 'success', 'warning'
    validator: (value) => ['info', 'danger', 'success', 'warning'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'close'])

const modalTypeClass = computed(() => `modal-${props.type}`)

const confirmButtonClass = computed(() => {
  const classes = {
    info: 'modal-btn-primary',
    danger: 'modal-btn-danger',
    success: 'modal-btn-success',
    warning: 'modal-btn-warning'
  }
  return classes[props.type] || 'modal-btn-primary'
})

const icon = computed(() => {
  const icons = {
    info: Info,
    danger: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle
  }
  return icons[props.type] || Info
})

const handleConfirm = () => {
  emit('confirm')
}

const handleClose = () => {
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
  max-width: 450px;
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
  position: relative;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
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

.modal-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
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

.modal-btn-primary:hover {
  background-color: var(--btn-primary-hover);
}

.modal-btn-danger {
  background-color: var(--btn-danger);
  color: white;
}

.modal-btn-danger:hover {
  background-color: var(--btn-danger-hover);
}

.modal-btn-success {
  background-color: var(--success);
  color: white;
}

.modal-btn-success:hover {
  opacity: 0.9;
}

.modal-btn-warning {
  background-color: var(--warning);
  color: white;
}

.modal-btn-warning:hover {
  opacity: 0.9;
}

.modal-info .modal-icon {
  color: var(--info);
}

.modal-danger .modal-icon {
  color: var(--btn-danger);
}

.modal-success .modal-icon {
  color: var(--success);
}

.modal-warning .modal-icon {
  color: var(--warning);
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