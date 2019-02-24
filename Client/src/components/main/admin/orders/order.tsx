import React, { PureComponent } from "react";
import Moment from "react-moment";
import { Icon, Switch, Row, Col, Button, Popconfirm } from "antd";
import { Order } from "../../../../models/order";
import "./orders.less";

interface CmpProps {
  order: Order;
  loading: boolean;
  updateOrderStatus: (id: string, status: Status) => void;
  removeOrder: (id: string) => void;
}

interface Visible {
  pop1: boolean;
  pop2: boolean;
}

interface CmpStates {
  showProducts: boolean;
  visible: Visible;
}

type Status = "Новый" | "В работе" | "Выполнено";

class AdminOrder extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      showProducts: false,
      visible: {
        pop1: false,
        pop2: false
      }
    };
  }
  private createClassName = (status: Status): string => {
    const mainClass = "order";
    switch (status) {
      case "Новый":
        return `${mainClass} ${mainClass}-new`;
      case "В работе":
        return `${mainClass} ${mainClass}-in-work`;
      case "Выполнено":
        return `${mainClass} ${mainClass}-done`;
      default:
        return `${mainClass}`;
    }
  };
  private addMaskOnPhone = (phone: string): string =>
    `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(
      6,
      8
    )}-${phone.slice(8, 10)}`;
  private nextStatus = (status: Status): string | null => {
    switch (status) {
      case "Новый":
        return "В работу";
      case "В работе":
        return "Выполнить";
      default:
        return null;
    }
  };
  private changeOrderStatus = (): void => {
    const { updateOrderStatus, order } = this.props;
    if (order.status === "Выполнено") return;
    if (order.status === "Новый")
      return updateOrderStatus(order._id, "В работе");
    if (order.status === "В работе")
      return updateOrderStatus(order._id, "Выполнено");
  };
  private handleVisibleChange = (pop: "pop1" | "pop2"): void => {
    if (this.props.loading) return;
    let visible: Visible = Object.create(this.state.visible);
    visible[pop] = !this.state.visible[pop];
    return this.setState({ visible });
  };
  render() {
    const { order, removeOrder, loading } = this.props;
    const { showProducts, visible } = this.state;
    const styledPhone = this.addMaskOnPhone(order.client.phone);
    let totalPrice: number = 0;
    const products = order.productList.map((product, index) => {
      const price = product.count * product.price;
      totalPrice += price;
      return (
        <Row key={`${Date.now()}${product.product}${index}`}>
          <Col span={10}>{product.product}</Col>
          <Col span={7}>{product.count}</Col>
          <Col span={7}>{price}</Col>
        </Row>
      );
    });
    const nextStatus = this.nextStatus(order.status);
    return (
      <div className={this.createClassName(order.status)}>
        <div className="order__actions">
          <p className="order__actions__status">{order.status}</p>
          {nextStatus !== null && (
            <div className="order__actions__buttons-group">
              <Popconfirm
                visible={visible.pop1}
                onVisibleChange={() => this.handleVisibleChange("pop1")}
                placement="bottomRight"
                title="Уверены?"
                onConfirm={this.changeOrderStatus}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  className="order__actions__buttons-group__button"
                  disabled={loading}
                >
                  {nextStatus}
                </Button>
              </Popconfirm>
              <Popconfirm
                visible={visible.pop2}
                onVisibleChange={() => this.handleVisibleChange("pop2")}
                placement="bottomRight"
                title="Уверены?"
                onConfirm={() => removeOrder(order._id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button disabled={loading}>Отменить</Button>
              </Popconfirm>
            </div>
          )}
        </div>
        <div className="order__client">
          <div className="order__client__name">
            <p className="order__client__icon">
              <Icon type="contacts" />
            </p>
            <p>{order.client.name}</p>
          </div>
          <div>
            <p className="order__client__icon">
              <Icon type="phone" />
            </p>
            <a href={`tel:+${order.client.phone}`}>{styledPhone}</a>
          </div>
        </div>
        <div className="order__products">
          <div className="order__products_title">
            <p className="order__products__title__text">Товары</p>
            <Switch
              onChange={() => this.setState({ showProducts: !showProducts })}
            />
          </div>
          {showProducts && (
            <div className="order__products__list">
              <Row className="order__products__list__title">
                <Col span={10}>Наименование</Col>
                <Col span={7}>Количество</Col>
                <Col span={7}>Стоимость</Col>
              </Row>
              {products}
            </div>
          )}
        </div>
        <div className="order__total-price">
          <p>Итоговая стоимость: {totalPrice}р.</p>
        </div>
        <div className="order__created">
          <Moment format="DD.MM.YYYY HH:mm" date={order.created} />
        </div>
      </div>
    );
  }
}

export default AdminOrder;
