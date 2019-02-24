import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { InputNumber, Row, Col, Icon, Popconfirm } from "antd";
import { connect } from "react-redux";
import { ProductCart } from "../../../store/cart/model";
import {
  editProductCart,
  removeProductCart
} from "../../../store/cart/actions";
import "./cart.less";

interface CmpProps {
  product: ProductCart;
  editProductCart: (id: string, count: number) => void;
  removeProductCart: (id: string) => void;
}

interface CmpStates {
  count: number;
}

class Product extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = { count: this.props.product.count };
  }
  private handleChange = (count: number | undefined): void => {
    if (!count) return;
    return this.setState({ count });
  };
  private handleBlur = (): void => {
    this.props.editProductCart(this.props.product.id, this.state.count);
  };
  private handleConfirm = (): void => {
    this.props.removeProductCart(this.props.product.id);
  };
  render() {
    const { product } = this.props;
    const { count } = this.state;
    return (
      <Row className="cart-product">
        <Col span={8} className="cart-product__name">
          <Link to={`/product/${product.id}`}>
            <p>{product.name}</p>
          </Link>
        </Col>
        <Col span={6}>
          <InputNumber
            min={1}
            max={product.stock}
            value={count}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />
        </Col>
        <Col span={6}>{product.price * this.state.count}</Col>
        <Col span={4}>
          <Popconfirm
            title="Уверены?"
            icon={<Icon type="stop" style={{ color: "red" }} />}
            onConfirm={this.handleConfirm}
            okText="Да"
            cancelText="Нет"
          >
            <span className="cart-product__remove">
              <Icon type="delete" />
            </span>
          </Popconfirm>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = { editProductCart, removeProductCart };

export default connect(
  null,
  mapDispatchToProps
)(Product);
