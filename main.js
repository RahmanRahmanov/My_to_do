const { createApp, ref, computed, watch } = Vue;

createApp({
  setup() {
    const newTask = ref('');
    const filter = ref('all');
    const hidden = ref(false);

    const tasks = ref(
      JSON.parse(localStorage.getItem('tasks')) || []
    );

    watch(tasks, () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    }, { deep: true });

    const addTask = () => {
      if (!newTask.value.trim()) return;
      tasks.value.push({
        id: Date.now(),
        text: newTask.value,
        time: new Date().toLocaleString(),
        done: false
      });
      newTask.value = '';
    };

    const toggleTask = (id) => {
      const task = tasks.value.find(t => t.id === id);
      task.done = !task.done;
    };

    const filteredTasks = computed(() => {
      let list = [...tasks.value];

      if (filter.value === 'done') {
        list = list.filter(t => t.done);
      }
      if (filter.value === 'todo') {
        list = list.filter(t => !t.done);
      }
      if (filter.value === 'new') {
        list.sort((a,b) => b.id - a.id);
      }
      if (filter.value === 'old') {
        list.sort((a,b) => a.id - b.id);
      }

      return list;
    });

    return {
      newTask,
      filter,
      hidden,
      addTask,
      toggleTask,
      filteredTasks
    };
  },

  template: `
    <div class="app">
      <h1>📝Задачи</h1>

      <div class="add">
        <input v-model="newTask" placeholder="Новая задача">
        <button @click="addTask">+</button>
      </div>

      <div class="controls">
        <select v-model="filter">
          <option value="all">Все</option>
          <option value="done">Выполненные</option>
          <option value="todo">Невыполненные</option>
          <option value="new">Новые</option>
          <option value="old">Старые</option>
        </select>

        <button class="toggle" @click="hidden = !hidden">
          {{ hidden ? 'Развернуть' : 'Свернуть' }}
        </button>
      </div>

      <div class="tasks" :class="{ hidden }">
        <div 
          class="task" 
          v-for="task in filteredTasks" 
          :key="task.id"
          :class="{ done: task.done }"
        >
          <div>
            <strong>{{ task.text }}</strong>
            <div class="task-time">{{ task.time }}</div>
          </div>

          <button @click="toggleTask(task.id)">
            {{ task.done ? '↩' : '✔' }}
          </button>
        </div>
      </div>
    </div>
  `
}).mount('#app');