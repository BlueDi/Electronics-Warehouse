import loadComponent from './load-component';

// define and export targeted async components
export const AddItem = loadComponent(() =>
  import(/* webpackChunkName: 'addItem' */ './addItem')
);
export const Course = loadComponent(() =>
  import(/* webpackChunkName: 'course' */ './course')
);
export const WHTable = loadComponent(() =>
  import(/* webpackChunkName: 'table' */ './table')
);
export const WHHeader = loadComponent(() =>
  import(/* webpackChunkName: 'header' */ './header')
);
export const WHMenu = loadComponent(() =>
  import(/* webpackChunkName: 'menu' */ './menu')
);
export const InDepthItem = loadComponent(() =>
  import(/* webpackChunkName: 'inDepthItem' */ './inDepthItem')
);
export const Request = loadComponent(() => 
  import(/* webpackChunkName: 'request' */ './request')
);
export const Requests = loadComponent(() => 
  import(/* webpackChunkName: 'requests' */ './requests')
);

// export Root as default, and also NotFound as named
export { default } from './root';
export { default as NotFound } from './notfound';
