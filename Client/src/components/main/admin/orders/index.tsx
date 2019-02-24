import React, { PureComponent } from "react";
import { message, Input, Col, Icon, Select } from "antd";
import { connect } from "react-redux";
import Order from "./order";
import { setPath } from "../../../../store/path/actions";
import { Path } from "../../../../store/path/model";
import { Orders } from "../../../../models/order";
import {
  getOrders,
  removeOrder,
  editOrder,
  getOrdersWithParams
} from "../../../../fetch/order";
import { ServerOrders } from "../../../../models/order";
import { Token } from "../../../../store/token/model";
import { Msg } from "../../../../models/msg";
import { State } from "../../../../store/index";
import "./orders.less";

const Search = Input.Search;
const Option = Select.Option;

interface CmpProps {
  token: Token;
  setPath: (path: Path) => void;
  updateCountOfNew: (countOfNew: number | undefined) => void;
}

interface CmpStates {
  loading: boolean;
  orders: Orders;
  search: string;
  sort: boolean;
  filter: string | undefined;
}

type Status = "Новый" | "В работе" | "Выполнено";

class AdminOrders extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      sort: true,
      filter: "",
      search: ""
    };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {
    this.props.setPath([{ id: "", name: "Заказы" }]);
    const token = this.props.token || null;
    await getOrders(token, (msg, data) => this.serverResProc(false, msg, data));
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private serverResProc = (
    shwMsg: boolean,
    msg: Msg,
    data: ServerOrders | undefined
  ): void => {
    if (this.isUnmounted) return;
    this.setState({ loading: false });
    shwMsg && message[msg.type](msg.text);
    if (!data) return;
    const { orders, countOfNew } = data;
    this.props.updateCountOfNew(countOfNew);
    return this.setState({ orders });
  };
  private updateOrderStatus = (id: string, status: Status): void => {
    this.setState({ loading: true });
    const token = this.props.token || null;
    const { search, sort, filter } = this.state;
    const orderProps = { search, sort, filter };
    const editedOrder = { id, status };
    editOrder(token, { orderProps, editedOrder }, (msg, data) =>
      this.serverResProc(true, msg, data)
    );
  };
  private removeOrder = (id: string): void => {
    this.setState({ loading: true });
    const token = this.props.token || null;
    const { search, sort, filter } = this.state;
    const orderProps = { search, sort, filter };
    const removedOrder = { id };
    removeOrder(token, { orderProps, removedOrder }, (msg, data) =>
      this.serverResProc(true, msg, data)
    );
  };
  private getOrdersWithParams_ = (): void => {
    this.setState({ loading: true });
    const token = this.props.token || null;
    const { search, sort, filter } = this.state;
    getOrdersWithParams(token, { search, sort, filter }, (msg, data) =>
      this.serverResProc(true, msg, data)
    );
  };
  private search = (search: string | undefined): void => {
    if (!search || search === this.state.search) return;
    return this.setState({ search }, () => this.getOrdersWithParams_());
  };
  private sort = (): void => {
    if (this.state.loading) return;
    return this.setState({ sort: !this.state.sort }, () =>
      this.getOrdersWithParams_()
    );
  };
  private filter = (filter: string | undefined): void => {
    if (!filter || filter === this.state.filter) return;
    return this.setState({ filter }, () => this.getOrdersWithParams_());
  };
  private allOrders = (): void => {
    return this.setState({ search: "", filter: "", sort: true }, () =>
      this.getOrdersWithParams_()
    );
  };
  render() {
    const { orders, sort, loading } = this.state;
    const OrderList = orders.map((order, index) => (
      <Order
        key={`${Date.now()}${order._id}${index}`}
        loading={loading}
        updateOrderStatus={this.updateOrderStatus}
        removeOrder={this.removeOrder}
        order={order}
      />
    ));
    return (
      <div className="orders">
        <div className="orders__actions">
          <div className="orders__actions__search">
            <Search
              className="orders__actions__search__input"
              placeholder="Поиск..."
              onSearch={this.search}
              disabled={loading}
            />
          </div>
          <div className="orders__actions__filters">
            <p className="orders__actions__filters__text">Выбрать</p>
            <Select
              className="orders__actions__filters__select"
              defaultValue=""
              disabled={loading}
              onChange={this.filter}
            >
              <Option value="Новый">только новые</Option>
              <Option value="В работе">только в работе</Option>
              <Option value="Выполнено">только выполненные</Option>
              <Option value="">все</Option>
            </Select>
          </div>
          <Col span={8} className="orders__actions__sorts">
            <span
              className="orders__actions__sorts__button"
              onClick={this.sort}
            >
              <p className="orders__actions__sorts__button__text">По дате</p>
              {sort ? <Icon type="caret-down" /> : <Icon type="caret-up" />}
            </span>
          </Col>
          <Col span={8} className="orders__actions__total">
            <p>Заказов найдено: {orders.length}</p>
          </Col>
          <Col span={8} className="orders__actions__sorts">
            <span
              className="orders__actions__sorts__button"
              onClick={this.allOrders}
            >
              <p className="orders__actions__sorts__button__text">Все заказы</p>
              <Icon type="undo" />
            </span>
          </Col>
        </div>
        {OrderList}
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ token: state.token });

const mapDispatchToProps = { setPath };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminOrders);
