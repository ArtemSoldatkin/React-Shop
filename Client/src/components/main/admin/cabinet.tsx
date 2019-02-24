import React, { PureComponent } from "react";
import {
  Switch,
  Route,
  Link,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import { Row, Col, Tag } from "antd";
import { connect } from "react-redux";
import { getCountOfNew } from "../../../fetch/order";
import { Token } from "../../../store/token/model";
import { State } from "../../../store/index";
import Orders from "./orders";
import Catalog from "./catalog";
import "./admin.less";

type PathParamsType = {
  id: string;
};

interface CmpProps extends RouteComponentProps<PathParamsType> {
  token: Token;
}

interface CmpStates {
  countOfNew: number;
}

class Cabinet extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = { countOfNew: 0 };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {
    const token = this.props.token || null;
    await getCountOfNew(token, (msg, data) => {
      if (this.isUnmounted) return;
      if (!data) return;
      const { countOfNew } = data;
      return this.setState({ countOfNew });
    });
  }
  componenWillUnmount() {
    this.isUnmounted = true;
  }
  private updateCountOfNew = (countOfNew: number | undefined): void => {
    if (countOfNew && countOfNew !== this.state.countOfNew)
      this.setState({ countOfNew });
  };
  render() {
    const { countOfNew } = this.state;
    return (
      <div className="admin-cabinet">
        <Row>
          <Col span={4} className="admin-cabinet__col">
            <Row className="admin-cabinet__col__row">
              <Link
                to="/admin/orders"
                className="admin-cabinet__col__row__actions"
              >
                <p className="admin-cabinet__col__row__actions__text">Заказы</p>{" "}
                {countOfNew > 0 && <Tag color="red">{countOfNew}</Tag>}
              </Link>
            </Row>
            <Row className="admin-cabinet__col__row">
              <Link
                to="/admin/catalog"
                className="admin-cabinet__col__row__actions"
              >
                <p className="admin-cabinet__col__row__actions__text">
                  Каталог
                </p>
              </Link>
            </Row>
          </Col>
          <Col span={20} className="admin-cabinet__col">
            <div className="admin-cabinet__col-main">
              <Switch>
                <Route path="/admin/catalog" render={() => <Catalog />} />
                <Route
                  path="/admin/orders"
                  render={() => (
                    <Orders updateCountOfNew={this.updateCountOfNew} />
                  )}
                />
              </Switch>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ token: state.token });

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Cabinet)
);
