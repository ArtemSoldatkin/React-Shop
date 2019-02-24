import React from "react";
import { Switch, Route } from "react-router-dom";
import Admin from "./admin";
import Cart from "./cart";
import Catalog from "./catalog";
import Error404 from "./errors/error-404";
import Product from "./product";
import "./main.less";

const Main = () => (
  <div className="main">
    <Switch>
      <Route exact path="/" component={Catalog} />
      <Route path="/product/:id" component={Product} />
      <Route path="/admin" component={Admin} />
      <Route path="/cart" component={Cart} />
      <Route path="*" component={Error404} />
    </Switch>
  </div>
);

export default Main;
