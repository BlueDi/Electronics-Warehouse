
import Layout, {
  NotFound,
  Home,
  WHTable,
  AddItem,
  InDepthItem
} from '@pages';

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
    component: WHTable
  },
  {
    path: '/addNewItem/',
    menu: 'AddItem',
    component: AddItem
  },
  {
    path: '/item/:id',
    component: InDepthItem
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
