import React, { PureComponent } from "react";
import { Col, message, Input } from "antd";
import { connect } from "react-redux";
import { setPath } from "../../../../store/path/actions";
import { Path } from "../../../../store/path/model";
import Categories from "./categories";
import CatalogProduct from "./product";
import CreateProduct from "./create-product";
import { getProductsByParam, removeProduct } from "../../../../fetch/product";
import { Products, Product } from "../../../../models/product";
import { Token } from "../../../../store/token/model";
import { State } from "../../../../store/index";
import { ServerProducts } from "../../../../models/product";
import "./catalog.less";

const { Search } = Input;

interface CmpProps {
  setPath: (path: Path) => void;
  token: Token;
}

interface CmpStates {
  loading: boolean;
  categoryID: string | undefined;
  search: string | undefined;
  products: Products;
  productsCount: number | undefined;
  selectedProduct: Product | undefined;
  visibleForm: boolean;
}

class Catalog extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      loading: true,
      categoryID: undefined,
      selectedProduct: undefined,
      visibleForm: false,
      search: undefined,
      products: [],
      productsCount: 0
    };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {
    this.props.setPath([{ id: "", name: "Каталог" }]);
    await this.fetchProducts(false);
  }
  componentDidUpdate(prevProps: CmpProps, prevState: CmpStates) {
    if (this.state.categoryID !== prevState.categoryID)
      this.fetchProducts(false);
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private fetchProducts = (showMessage: boolean): void => {
    this.setState({ loading: true });
    const { categoryID, search } = this.state;
    getProductsByParam({ categoryID, search }, (msg, data) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      if (showMessage) message[msg.type](msg.text);
      if (!data) return this.setState({ products: [] });
      const { products, count: productsCount } = data;
      return this.setState({ products, productsCount });
    });
  };
  private onSearch = (search: string): void => {
    if (search === this.state.search) return;
    return this.setState({ search }, () => this.fetchProducts(true));
  };
  private allProducts = (): void => {
    this.setState({ search: undefined, categoryID: undefined }, () =>
      this.fetchProducts(true)
    );
  };
  private removeProduct = (productID: string): void => {
    this.setState({ loading: true });
    const token = this.props.token || null;
    removeProduct(token, { id: productID }, (msg, data) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      message[msg.type](msg.text);
      if (!data) return;
      const { products, count: productsCount } = data;
      return this.setState({ products, productsCount });
    });
  };
  private selectProduct = (productID: string): void => {
    const selectedProduct = this.state.products.find(
      product => product._id === productID
    );
    if (!selectedProduct) return;
    return this.setState({ selectedProduct }, () =>
      this.setState({ visibleForm: true })
    );
  };
  private updateProducts = (data: ServerProducts): void => {
    const { products, count: productsCount } = data;
    this.setState({ products, productsCount });
  };
  private addNewProduct = (): void => {
    this.setState({ selectedProduct: undefined }, () =>
      this.setState({ visibleForm: true })
    );
  };
  private closeForm = (): void => {
    this.setState({ visibleForm: false });
  };
  public selectCategory = (categoryID: string | undefined): void => {
    if (!categoryID) return this.setState({ categoryID: undefined });
    return this.setState({ categoryID });
  };
  render() {
    const {
      products,
      loading,
      productsCount,
      categoryID,
      visibleForm,
      selectedProduct
    } = this.state;
    const productList = products.map((product, index) => (
      <CatalogProduct
        key={`${Date.now()}${product._id}${index}`}
        selectProduct={this.selectProduct}
        removeProduct={this.removeProduct}
        product={product}
        loading={loading}
      />
    ));
    return (
      <div className="admin-catalog">
        <Col span={12}>
          <div className="admin-catalog__title">
            <p>Категории</p>
          </div>
          <Categories selectCategory={this.selectCategory} />
        </Col>
        <Col span={12}>
          <div className="admin-catalog__title">
            <p>Товары</p>
          </div>
          <Search
            className="admin-catalog__search"
            placeholder="Поиск..."
            onSearch={this.onSearch}
            disabled={loading}
          />
          <div className="admin-catalog__actions">
            <span
              className="admin-catalog__actions__all-products"
              onClick={this.allProducts}
            >
              Все товары
            </span>
            <div className="admin-catalog__actions__add-product">
              <CreateProduct
                addNewProduct={this.addNewProduct}
                updateProducts={this.updateProducts}
                selectedProduct={selectedProduct}
                closeForm={this.closeForm}
                categoryID={categoryID}
                visibleForm={visibleForm}
              />
            </div>
          </div>
          <div className="admin-catalog-products">
            <div className="admin-catalog-products__table">
              <Col span={20} className="admin-catalog-products__table__title">
                Наименование
              </Col>
              <Col span={4} className="admin-catalog-products__table__title">
                Товаров: {productsCount}
              </Col>
            </div>
            {productList}
          </div>
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ token: state.token });

const mapDispatchToProps = { setPath };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catalog);
