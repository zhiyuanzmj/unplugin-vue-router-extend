import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
})

const app = createApp(App)

app.use(router)

app.mount('#app')
