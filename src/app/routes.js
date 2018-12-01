import Layout, {
  NotFound,
  AddItem,
  Course,
  InDepthItem,
  WHTable,
  RequestsCartList,
  RequestsList,
  Request
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
    path: '/requests_cart',
    component: RequestsCartList
  },
  {
    path: '/requests_list',
    component: RequestsList
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
