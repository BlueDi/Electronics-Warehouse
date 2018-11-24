import Layout, {
  NotFound,
  Home,
  AddItem,
  Course,
  InDepthItem,
  WHTable,
  Requests,
  Request
} from '@pages';

export const routes = [
  {
    path: '/',
    exact: true,
    menu: 'Home',
    component: Home
  },
  {
    path: '/course',
    menu: 'Course',
    component: Course
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
    path: '/table/:id',
    menu: 'Table',
    component: WHTable
  },
  {
    path: '/requests',
    component: Requests
  },
  {
    path: '/request/:id',
    component: Request
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
