# Personal Kanban Board

A clean, personal Kanban board for individual productivity — manage your tasks, track progress, and stay organized.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?logo=vue.js&logoColor=white)](https://pinia.vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

A thoughtfully designed personal Kanban board to help you organize daily tasks, track progress, and boost productivity. Built for individuals who want a simple yet powerful tool to manage personal projects and daily todos — no account needed, no cloud tracking, just your tasks, your way.

## Features

| Feature | Description |
|---------|-------------|
| Drag and Drop | Move tasks between columns with smooth native HTML5 drag-and-drop |
| Task Management | Create, edit, and delete tasks with confirmation modals |
| Persistent Storage | All data automatically saved to localStorage |
| Dark Mode | Toggle between light and dark themes (preference saved) |
| Data Export and Import | Backup and restore your board using JSON files |
| Responsive Design | Works on desktop, tablet, and mobile devices |
| Task Counters | Real-time task counts per column |
| Creation Timestamps | See when each task was added with relative dates |

## Tech Stack

- **Vue 3** - Composition API with script setup syntax
- **Pinia** - State management with persistent storage
- **Vite** - Fast build tool and development server
- **Lucide Vue Next** - Beautiful, consistent icon set
- **CSS3** - Custom styling with CSS variables for theming

## Project Structure

```
personal-kanban-board/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.vue      # Main board container
│   │   ├── KanbanColumn.vue     # Individual column component
│   │   ├── TaskCard.vue         # Task card with edit/delete
│   │   ├── AddTaskModal.vue     # Modal for adding tasks
│   │   └── Modal.vue            # Reusable modal component
│   ├── stores/
│   │   └── kanbanStore.js       # Pinia store with actions
│   ├── App.vue                   # Root component
│   ├── main.js                   # Application entry point
│   └── style.css                 # Global styles with themes
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/personal-kanban-board.git

# Navigate to project directory
cd personal-kanban-board

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## How to Use

### Basic Operations

| Action | How To |
|--------|--------|
| Add a task | Click "Add Task" button, enter description, submit |
| Edit a task | Click edit icon on any task card, edit text, save |
| Delete a task | Click delete icon, confirm deletion |
| Move a task | Drag and drop card between columns |
| Toggle theme | Click theme icon in header |
| Export data | Click "Export" button, save JSON file |
| Import data | Click "Import" button, select JSON backup |

### Three-Column Workflow

| Column | Purpose |
|--------|---------|
| To Do | Tasks you plan to accomplish |
| In Progress | What you're working on right now |
| Done | Completed tasks |

### Personal Productivity Tips

1. Brain dump - Add all your tasks to "To Do" first
2. Limit WIP - Keep only 1-3 tasks "In Progress" at a time
3. Daily review - Spend 5 minutes each morning planning
4. Celebrate wins - Move tasks to "Done" and track accomplishments

## Customization

### Color Scheme

CSS variables in `style.css` for easy theming:

```css
:root {
  --bg-primary: #f3f4f6;
  --bg-secondary: #ffffff;
  --btn-primary: #3b82f6;
  --btn-danger: #ef4444;
  --success: #10b981;
}
```

### Custom Columns

Modify `stores/kanbanStore.js`:

```javascript
columns: ['backlog', 'current', 'complete'],
columnNames: {
  backlog: 'Backlog',
  current: 'Current Sprint', 
  complete: 'Complete'
}
```

## Responsive Design

| Device | Layout |
|--------|--------|
| Desktop | Horizontal 3-column grid |
| Tablet | Flexible columns with adjusted spacing |
| Mobile | Single-column vertical layout |

## Privacy First

- All data stays on your device only
- No cloud storage, no tracking, no analytics
- Your personal tasks are truly private
- Full control over exports and backups

## Sample Tasks to Get Started

Add these to start your productivity journey:

- Review weekly goals
- Complete morning routine
- Learn something new today
- Plan tomorrow's schedule
- Respond to important messages

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Vue.js - The Progressive JavaScript Framework
- Pinia - Intuitive store for Vue
- Lucide - Beautiful open-source icons
- Vite - Next generation frontend tooling

## Contact

For questions or feedback, please open an issue on GitHub.

---

Take control of your tasks today. Start with one small task and build momentum.

Made for personal productivity
