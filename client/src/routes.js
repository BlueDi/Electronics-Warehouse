import Home from "./Home";
import WHInventory from "./Inventory";
import AddItem from "./AddItem";

const routes = [
  {
    path: "/",
    component: Home,
    exact: true
  },
  {
    path: "/table/:id",
    component: WHInventory
  },
  {
    path: "/addItem",
    component: AddItem
  }
];

export default routes;
