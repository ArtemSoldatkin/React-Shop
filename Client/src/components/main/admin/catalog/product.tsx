import React, { PureComponent } from "react";
import { Col, Icon, Popconfirm } from "antd";
import { Product } from "../../../../models/product";
import "./catalog.less";

interface CmpProps {
  product: Product;
  loading: boolean;
  selectProduct: (productID: string) => void;
  removeProduct: (productID: string) => void;
}

interface CmpStates {
  visible: boolean;
}

class CatalogProducts extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = { visible: false };
  }
  private handleVisibleChange = (visible: boolean): void => {
    if (this.props.loading) return;
    return this.setState({ visible });
  };
  private handleSelect = (): void => {
    const { product, selectProduct } = this.props;
    selectProduct(product._id);
  };
  private handleRemove = (): void => {
    const { product, removeProduct } = this.props;
    removeProduct(product._id);
  };
  render() {
    const { product } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <Col span={20} className="admin-catalog-products__product">
          <span onClick={this.handleSelect}>{product.name}</span>
        </Col>
        <Col span={4}>
          <Popconfirm
            placement="topRight"
            title="Уверены?"
            visible={visible}
            onVisibleChange={this.handleVisibleChange}
            onConfirm={this.handleRemove}
            okText="Да"
            cancelText="Нет"
          >
            <span className="admin-catalog-products__del">
              <Icon type="delete" />
            </span>
          </Popconfirm>
        </Col>
      </div>
    );
  }
}

export default CatalogProducts;
