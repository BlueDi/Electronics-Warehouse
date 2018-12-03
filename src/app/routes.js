import Root, { AddItem, Course, InDepthItem, NotFound, WHTable } from '@pages';

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
