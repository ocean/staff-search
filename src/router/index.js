import Vue from 'vue';
import Router from 'vue-router';
import AsyncComputed from 'vue-async-computed';
import StaffSearch from '@/components/StaffSearch';

Vue.use(Router);
Vue.use(AsyncComputed);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StaffSearch',
      component: StaffSearch,
    },
  ],
});
