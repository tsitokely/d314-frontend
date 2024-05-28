import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cities',
      name: 'cities',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Cities/View.vue')
    },
    {
      path: '/apartment',
      name: 'apartment',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Apartments/ViewCityFiltered.vue')
    },
    {
      path: '/Apartments/:CityId/:YearStart-:WeekStart/:YearEnd-:WeekEnd',
      name: 'apartmentInCityInPeriod',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Apartments/ViewCityFiltered.vue')
    },
    {
      path: '/Apartments/:ApartmentId',
      name: 'apartmentDetail',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Apartments/ViewDetails.vue')
    },
    {
      path: '/reservations',
      name: 'reservations',
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Reservations/View.vue')
    }
  ]
})

export default router
