import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Col, Input, message } from "antd";
import { State } from "../../../store";
import { Path } from "../../../store/path/model";
import { clearPath } from "../../../store/path/actions";
import { Products } from "../../../models/product";
import { getProductsByParam } from "../../../fetch/product";
import Categories from "./categories";
import Product from "./product";
import "./catalog.less";

const { Search } = Input;

interface CmpProps {
  path: Path;
  clearPath: () => void;
}

interface CmpStates {
  products: Products;
  search: string | undefined;
  searchCount: number | undefined;
  loading: boolean;
}

class Catalog extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      products: [],
      search: undefined,
      searchCount: undefined,
      loading: true
    };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {
    await this.fetchProducts(false, false);
  }
  componentDidUpdate(prevProps: CmpProps) {
    if (this.props.path !== prevProps.path) this.fetchProducts(false, false);
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private fetchProducts = async (
    showMessage: boolean,
    searchable: boolean
  ): Promise<void> => {
    const { path } = this.props;
    const categoryID =
      path && path.length > 0 ? path[path.length - 1].id : undefined;
    const search = searchable ? this.state.search : undefined;
    this.setState({ loading: true });
    await getProductsByParam({ categoryID, search }, (msg, data) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      if (showMessage) message[msg.type](msg.text, 1);
      if (!data) return;
      const { products, count: searchCount } = data;
      return this.setState({ products, searchCount });
    });
  };
  private getAllProducts = (): void => {
    if (this.state.loading) return;
    this.props.clearPath();
    return this.setState({ search: undefined }, () =>
      this.fetchProducts(true, false)
    );
  };
  private onSearch = (val: string): void => {
    if (val === this.state.search) return;
    return this.setState({ search: val }, () => this.fetchProducts(true, true));
  };
  render() {
    const { products, searchCount, loading } = this.state;
    const ProductList = products.map((product, index) => (
      <Product key={`${Date.now()}${product._id}${index}`} product={product} />
    ));
    return (
      <div className="catalog">
        <Col span={4}>
          <div className="catalog__all-products" onClick={this.getAllProducts}>
            <p>Все товары</p>
          </div>
          <Categories />
        </Col>
        <Col span={20}>
          <div className="catalog__filters">
            <div className="catalog__filters__search">
              <div>
                <Search
                  className="catalog__filters__search__input"
                  placeholder="Поиск..."
                  onSearch={this.onSearch}
                  disabled={loading}
                />
                {searchCount !== undefined && (
                  <p className="catalog__filters__search__result">
                    Товаров найдено: {searchCount}
                  </p>
                )}
              </div>
            </div>
          </div>
          {ProductList}
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ path: state.path });

const mapDispatchToProps = { clearPath };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catalog);
