// Все для VUE
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';

import { createApp } from 'vue'
import App from './App.vue'

import router from './router.js'

// Рендер в HTML
createApp(App).use(router).mount('#app')
