import React, { memo } from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { State } from "../../../store";
import { Cart } from "../../../store/cart/model";
import Product from "./product";
import "./cart.less";

interface CmpProps {
  cart: Cart;
}

const Products = memo(({ cart }: CmpProps) => {
  let totalPrice: number = 0;
  const products = cart.map((product, index) => {
    totalPrice += product.count * product.price;
    return <Product key={index} product={product} />;
  });
  return (
    <div>
      <Row>
        <h4>Итоговая стоимость: {totalPrice}</h4>
      </Row>
      <Row>
        <Row>
          <Col span={8}>Наименование</Col>
          <Col span={6}>Количество</Col>
          <Col span={6}>Стоимость</Col>
        </Row>
        {products}
      </Row>
    </div>
  );
});

const mapStateToProps = (state: State) => ({ cart: state.cart });

export default connect(
  mapStateToProps,
  null
)(Products);
