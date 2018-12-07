import loadComponent from './load-component';

// define and export targeted async components

export const Home = loadComponent('home');
export const WHMenu = loadComponent(() => import('./menu'));
export const Course = loadComponent(() => import('./course'));
export const WHTable = loadComponent(() => import('./table'));
export const Request = loadComponent(() => import('./request'));
export const WHHeader = loadComponent(() => import('./header'));
export const AddItem = loadComponent(() => import('./addItem'));
export const InDepthItem = loadComponent(() => import('./inDepthItem'));
export const RequestsList = loadComponent(() => import('./requests_list'));
export const RequestsCartList = loadComponent(() => import('./requests_cart'));

// export Root as default, and also NotFound as named
export { default } from './root';
export { default as NotFound } from './notfound';
