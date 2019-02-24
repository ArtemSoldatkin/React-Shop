import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { message, Button, Steps } from "antd";
import { MessageType } from "antd/lib/message";
import { setPath } from "../../../store/path/actions";
import { Path } from "../../../store/path/model";
import { State } from "../../../store";
import { Cart } from "../../../store/cart/model";
import { Client, NewOrder } from "../../../models/order";
import Products from "./products";
import UserData from "./user-data";
import ThanksPage from "./thanks-page";
import { addOrder } from "../../../fetch/order";
import { clearCart } from "../../../store/cart/actions";
import "./cart.less";

const Step = Steps.Step;

interface CmpProps {
  setPath: (path: Path) => void;
  cart: Cart;
  clearCart: () => void;
}
interface CmpStates {
  current: number;
  status: boolean;
  loading: boolean;
  order: NewOrder;
}

class MainCart extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      current: 0,
      status: true,
      loading: false,
      order: {
        client: { name: "", phone: "" },
        productList: []
      }
    };
  }
  isUnmounted: boolean = false;
  componentDidMount() {
    this.props.setPath([{ id: "", name: "Корзина" }]);
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private next = (): void => this.setState({ current: this.state.current + 1 });
  private prev = (): void => this.setState({ current: this.state.current - 1 });
  private productTab = (): void | MessageType =>
    this.props.cart.length > 0
      ? this.next()
      : message.error("Выберите товары!");
  private setOrder = (client: Client): void => {
    const productList = this.props.cart.map(product => ({
      product: product.name,
      price: product.price,
      count: product.count
    }));
    this.setState({ order: { client, productList } });
  };
  private sendOrder = async (client: Client | undefined): Promise<void> => {
    client && (await this.setOrder(client));
    const { order } = this.state;
    this.setState({ loading: true });
    addOrder(order, msg => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      message[msg.type](msg.text);
      if (msg.type === "success")
        return this.setState({ status: true }, () => {
          this.props.clearCart();
          client && this.next();
        });
      return this.setState({ status: false }, () => client && this.next());
    });
  };
  render() {
    const { current, loading, status } = this.state,
      steps = [
        {
          title: "Товары",
          content: <Products />
        },
        {
          title: "Личные данные",
          content: <UserData loading={loading} sendOrder={this.sendOrder} />
        },
        {
          title: "Оформление",
          content: (
            <ThanksPage
              loading={loading}
              sendOrder={this.sendOrder}
              status={status}
            />
          )
        }
      ];
    return (
      <div className="cart">
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action cart__actions">
          {current === 0 && (
            <Button type="primary" onClick={this.productTab}>
              Дальше
            </Button>
          )}
          {current === 1 && (
            <Button
              form="order"
              key="orderSubmit"
              type="primary"
              htmlType="submit"
              disabled={loading}
            >
              Купить
            </Button>
          )}
          {((current > 0 && current < 2) ||
            (current === 2 && !this.state.status)) && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Назад
            </Button>
          )}
        </div>
        <Steps current={current} className="cart__steps">
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ cart: state.cart });

const mapDispatchToProps = { setPath, clearCart };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainCart);
