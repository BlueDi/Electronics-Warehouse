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
    component: WHTable
  },
  {
    path: '/addNewItem/',
    component: AddItem
  },
  {
    path: '/item/:id',
    component: InDepthItem
  },
  {
    path: '/course',
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
