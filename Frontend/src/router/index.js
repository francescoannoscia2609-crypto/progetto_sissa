import { createRouter, createWebHistory } from 'vue-router'
import UserRegistration from '../components/UserRegistration.vue'
import UserLogin from '../components/UserLogin.vue'
import Dashboard from '../components/Dashboard_frontend.vue'
import TestResults from '../components/TestResults.vue'
import TestHistory from '../components/TestHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/registration',
    },
    {
      path: '/registration',
      name: 'Registration',
      component: UserRegistration,
    },
    {
      path: '/login',
      name: 'Login',
      component: UserLogin,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/results',
      name: 'Results',
      component: TestResults,
    },
    {
      path: '/history',
      name: 'History',
      component: TestHistory,
    },
  ],
})

export default router
