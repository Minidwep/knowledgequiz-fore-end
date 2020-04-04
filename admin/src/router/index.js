import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Login from '../views/Login'
import InitSystem from '../views/InitSystem'
import StudentMannager  from '../views/StudentMannager'
import TeacherMannager from '../views/TeacherMannager'
import CourseMannager from '../views/CourseMannager'
import QuestionMannager from '../views/QuestionMannager'

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
    path: '/',
    component: Login
  },
  {
    path: '/Index',
    component: Index,
    children:[
      {
        path: '/InitSystem',
        name: 'InitSystem',
        component: InitSystem,
        
      },
      
      {
        path: '/StudentMannager',
        name: 'StudentMannager',
        component: StudentMannager
      },
      {
        path: '/TeacherMannager',
        name: 'TeacherMannager',
        component: TeacherMannager
      },
      {
        path: '/CourseMannager',
        name: 'CourseMannager',
        component: CourseMannager
      }
      ,
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
