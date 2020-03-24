import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/users/User'
import Right from '@/components/power/Right'
import Roles from '@/components/power/Roles'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'user',
        component: User
      },
      {
        path: '/rights',
        name: 'rights',
        component: Right
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path === '/login') return next()
  const getToken = window.sessionStorage.getItem('token')
  if (!getToken) return next('/login')
  next()
})

export default router
