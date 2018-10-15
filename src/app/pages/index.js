import loadComponent from './load-component';

// define and export targeted async components
export const Home = loadComponent('home');
export const Todos = loadComponent('todos');
export const TableExample = loadComponent('tableexample');
export const WHHeader = loadComponent('header');
export const WHMenu = loadComponent('menu');
export const AddItem = loadComponent('addItem');

// export Layout as default, and also NotFound as named
export { default } from './layout';
export { default as NotFound } from './notfound';
