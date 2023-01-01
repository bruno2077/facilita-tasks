import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import TodoPage from '../views/TodoPage/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/app',
    component: TodoPage,
    children: [
      {
        path: '',					
        redirect: 'dashboard',
      },
      {
        path: 'dashboard',
        name: 'dash',
        component: () => import("../views/TodoPage/Dashboard.vue")
      },
      {
        path: 'tarefas',
        name: 'tasks',
        component: () => import('../views/TodoPage/Tasks.vue')
      },
      {
        path: 'config',
        name: 'conf',
        component: () => import('../views/TodoPage/Configuration.vue')
      }				
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
