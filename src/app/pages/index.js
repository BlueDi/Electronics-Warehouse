import loadComponent from './load-component';

// define and export targeted async components
export const Home = loadComponent('home');
export const WHMenu = loadComponent('menu');
export const Course = loadComponent('course');
export const WHTable = loadComponent('table');
export const Request = loadComponent('request');
export const WHHeader = loadComponent('header');
export const AddItem = loadComponent('addItem');
export const InDepthItem = loadComponent('inDepthItem');
export const RequestsList = loadComponent('requests_list');
export const RequestsCartList = loadComponent('requests_cart');

// export Root as default, and also NotFound as named
export { default } from './root';
export { default as NotFound } from './notfound';
