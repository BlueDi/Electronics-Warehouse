import Home from "./Home";
import TableExample from "./Table";

const routes = [
  {
    path: "/",
    component: Home,
    exact: true
  },
  {
    path: "/table/:id",
    component: TableExample
  }
];

export default routes;
