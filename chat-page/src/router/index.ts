import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { UserModule } from '@/store/modules/user';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Index',
    redirect: (to) => {
      return '/home';
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    meta: { needLogin: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/chat/Chat.vue'),
    meta: { needLogin: true },
    children: [
      {
        path: 'chatapp',
        component: () => import(/* webpackChunkName: "chatapp" */ '../views/chat/ChatApp.vue'),
      }
    ]
  },
  {
    path: '*',
    name: '404',
    redirect: (to) => {
      return '/home';
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needLogin)) {
    if (!UserModule || !UserModule.user) {
      next({
        path: '/home'
      })
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
