import loadComponent from './load-component';

// define and export targeted async components
export const Course = loadComponent('course');
export const Home = loadComponent('home');
export const WHTable = loadComponent('table');
export const WHHeader = loadComponent('header');
export const WHMenu = loadComponent('menu');
export const AddItem = loadComponent('addItem');
export const InDepthItem = loadComponent('inDepthItem');
export const RequestList = loadComponent('requests')

// export Layout as default, and also NotFound as named
export { default } from './layout';
export { default as NotFound } from './notfound';
