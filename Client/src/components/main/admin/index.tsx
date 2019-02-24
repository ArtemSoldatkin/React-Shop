import React, { memo } from "react";
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteComponentProps
} from "react-router";
import { connect } from "react-redux";
import { State } from "../../../store";
import Authorization from "./authorization";
import Cabinet from "./cabinet";
import Error404 from "../errors/error-404";
import { Token } from "../../../store/token/model";

type PathParamsType = {
  id: string;
};

interface CmpProps extends RouteComponentProps<PathParamsType> {
  token: Token;
}

const Admin = memo(({ token }: CmpProps) => {
  return (
    <Switch>
      <Route
        exact
        path="/admin"
        render={() =>
          token ? <Redirect to="/admin/orders" /> : <Authorization />
        }
      />
      <Route
        path="/admin/orders"
        render={() => (token ? <Cabinet /> : <Redirect to="/admin" />)}
      />
      <Route
        path="/admin/catalog"
        render={() => (token ? <Cabinet /> : <Redirect to="/admin" />)}
      />
      <Route exact path="*" component={Error404} />
    </Switch>
  );
});

const mapStateToProps = (state: State) => ({ token: state.token });

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Admin)
);
