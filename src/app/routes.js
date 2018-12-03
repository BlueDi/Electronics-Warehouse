import Root, {
    AddItem,
    Course,
    InDepthItem,
    NotFound,
    Request,
    Requests,
    WHTable
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
    path: '/requests',
    component: Requests
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
