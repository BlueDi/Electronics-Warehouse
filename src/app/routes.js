import Layout, {
  NotFound,
  Home,
  AddItem,
  Course,
  InDepthItem,
  TableExample
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
