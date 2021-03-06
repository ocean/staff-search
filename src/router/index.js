import Vue from 'vue';
import Router from 'vue-router';
import StaffSearch from '@/components/StaffSearch';
import StaffProfile from '@/components/StaffProfile';
import OrganisationListing from '@/components/OrganisationListing';

Vue.use(Router);

export default new Router({
  base: process.env.ROUTER_BASE,
  routes: [
    {
      path: '/',
      name: 'StaffSearch',
      component: StaffSearch,
      props: true,
    },
    {
      path: '/person/:userid',
      name: 'StaffProfile',
      component: StaffProfile,
      props: true,
    },
    {
      path: '/organisation',
      name: 'OrganisationListing',
      component: OrganisationListing,
      props: route => ({ query: route.query }),
    },
  ],
});
