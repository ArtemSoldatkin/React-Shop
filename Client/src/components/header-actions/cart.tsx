import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip, Icon, Tag } from "antd";
import { State } from "../../store";
import { Cart } from "../../store/cart/model";
import { checkProductCart } from "../../store/cart/actions";
import "./header-actions.less";

interface CmpProps {
  cart: Cart;
  checkProductCart: () => void;
}

class HeaderActionsCart extends PureComponent<CmpProps> {
  constructor(props: CmpProps) {
    super(props);
  }
  componentDidMount() {
    this.props.checkProductCart();
  }
  private totalCost = (cart: Cart): number => {
    let cost: number = 0;
    cart.map(product => (cost += product.price * product.count));
    return cost;
  };
  render() {
    const { cart } = this.props;
    return (
      <Link to="/cart" className="header-actions-cart">
        <Tooltip title="В корзину" placement="bottom">
          <Icon
            type="shopping-cart"
            theme="outlined"
            className="header-actions-cart__icon"
          />
          <p className="header-actions-cart__cost">{`${this.totalCost(
            cart
          )}р.`}</p>
          <Tag color="red" className="header-actions-cart__product-count">
            {cart.length}
          </Tag>
        </Tooltip>
      </Link>
    );
  }
}

const mapStateToProps = (state: State) => ({ cart: state.cart });

const mapDispatchToProps = { checkProductCart };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderActionsCart);
