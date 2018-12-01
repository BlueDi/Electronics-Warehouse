import Layout, {
  NotFound,
  AddItem,
  Course,
  InDepthItem,
  WHTable,
  RequestCartList
} from '@pages';

export const routes = [
  {
    path: '/',
    exact: true,
    menu: 'Home',
    component: WHTable
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
    path: '/request_cart',
    component: RequestCartList
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
