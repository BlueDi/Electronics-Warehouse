import Root, {
  AddItem,
  Course,
  InDepthItem,
  NotFound,
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
    path: '/addNewItem/',
    menu: 'AddItem',
    component: AddItem
  },
  {
    path: '/item/:id',
    component: InDepthItem
  },
  {
    path: '/course',
    menu: 'Course',
    component: Course
  },
  {
    path: '/request/:id',
    component: Request
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
    path: '/table/:id',
    menu: 'Table',
    component: WHTable
  },
  {
    path: '/*',
    component: NotFound
  }
];

export default [
  {
    component: Root,
    routes
  }
];
