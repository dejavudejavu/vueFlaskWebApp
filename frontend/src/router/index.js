import { createRouter, createWebHistory } from 'vue-router'
import ArticleList from '../views/ArticleList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ArticleList
    }
  ]
})

export default router 