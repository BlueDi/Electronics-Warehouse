import Layout, { NotFound, Home, TableExample } from '@pages';

export const routes = [
  {
    path: '/',
    exact: true,
    menu: 'Home',
    component: Home
  },
  {
    path: '/table/:id',
    menu: 'Table',
    component: TableExample
  },
  {
    path: '/*',
    component: NotFound
  }
];

export default [
  {
    component: Layout,
    routes
  }
];
