import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Login from '../views/Login'
import QuestionInfo from '../views/QuestionInfo'
import AllQuestion  from '../views/AllQuestion'
import QuestionSort from '../views/QuestionSort'
import UserInfo from '../views/UserInfo'
import NewProblem from '../views/NewProblem'
import QuestionMannager from '../views/QuestionMannager'
import Hello from '@/components/Hello'
import Router from 'vue-router'


Vue.use(VueRouter)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

const routes = [
  {
    path: '/Login',
    component: Login
  },
  {
    path: '/Hello',
    name: 'Hello',
    component: Hello
  },

  {
    path: '/',
    component: Login
  },
  {
    path: '/Index',
    component: Index,
    children:[
      {
        path: '/AllQuestion',
        name: 'AllQuestion',
        component: AllQuestion,
        
      },
      
      {
        path: '/QuestionSort',
        name: 'QuestionSort',
        component: QuestionSort
      },
      {
        path: '/UserInfo',
        name: 'UserInfo',
        component: UserInfo
      },
      {
        path: '/NewProblem',
        name: 'NewProblem',
        component: NewProblem
      },
      {
        path: '/QuestionInfo',
        name: 'QuestionInfo',
        component: QuestionInfo
      },
      {
        path: '/QuestionMannager',
        name: 'QuestionMannager',
        component: QuestionMannager
      }
    ]
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
