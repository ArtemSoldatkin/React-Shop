import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, InputNumber, Icon } from "antd";
import { Product } from "../../../models/product";
import QuickBuy from "./quick-buy";
import { addProductCart } from "../../../store/cart/actions";
import { ProductCart, Cart } from "../../../store/cart/model";
import { State } from "../../../store";
import "./buy.less";

interface CmpProps {
  product: Product;
  cart: Cart;
  addProductCart: (productCart: ProductCart) => void;
}

interface CmpStates {
  inCart: boolean;
  count: number;
}

class Buy extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      inCart: false,
      count: 1
    };
  }
  componentDidMount() {
    const check = this.props.cart.find(
      product => product.id === this.props.product._id
    );
    if (check) return this.setState({ inCart: true });
    return this.setState({ inCart: false });
  }
  componentDidUpdate(prevProps: CmpProps) {
    if (this.props.cart !== prevProps.cart) {
      const check = this.props.cart.find(
        product => product.id === this.props.product._id
      );
      if (check) return this.setState({ inCart: true });
      return this.setState({ inCart: false });
    }
  }
  private onChange = (count: number | undefined): void => {
    if (!count || count === this.state.count) return;
    return this.setState({ count });
  };
  private addToCart = (): void => {
    const { _id: id, name, price, count: stock } = this.props.product;
    const { count } = this.state;
    const productCart = { id, name, price, count, stock };
    this.props.addProductCart(productCart);
  };
  render() {
    const { inCart, count } = this.state;
    const { _id: id, name, price, count: stock } = this.props.product;
    const productCart = { id, name, price, count, stock };
    return (
      <div className="buy">
        <InputNumber
          className="buy__input"
          min={1}
          max={stock}
          value={count}
          onChange={this.onChange}
        />
        {inCart ? (
          <Link to="/cart" className="ant-btn buy__button">
            <Icon type="check" /> <p>В корзине</p>
          </Link>
        ) : (
          <Button
            onClick={this.addToCart}
            type="primary"
            className="buy__button"
          >
            <Icon type="shopping-cart" theme="outlined" /> <p>Купить</p>
          </Button>
        )}
        <QuickBuy productCart={productCart} />
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ cart: state.cart });

const mapDispatchToProps = { addProductCart };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Buy);
