import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Avatar, Row, Col } from "antd";
import { setPath } from "../../../store/path/actions";
import { Path } from "../../../store/path/model";
import { Product } from "../../../models/product";
import { getProduct } from "../../../fetch/product";
import Buy from "../buy";
import Error404 from "../errors/error-404";
import "./product.less";

type PathParamsType = {
  id: string;
};

type CmpProps = RouteComponentProps<PathParamsType> & {
  setPath: (path: Path) => void;
};

interface CmpStates {
  product: Product;
  currentImage: string;
  loading: boolean;
}

class MainProduct extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      product: {
        _id: "",
        name: "",
        price: 0,
        count: 0,
        description: "",
        images: [],
        path: []
      },
      currentImage: "",
      loading: true
    };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {   
    const { id } = this.props.match.params;
    if (!id) return;
    await getProduct({ id }, (msg, product) => {
      if (!product) return;
      this.props.setPath(product.path);
      return this.setState({
        product,
        currentImage:
          product.images[this.getRandomImage(product.images.length)],
        loading: false
      });
    });
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private getRandomImage = (length: number): number =>
    Math.floor(Math.random() * length);
  private changeImage = (image: string): void =>
    this.setState({ currentImage: image });
  render() {
    const { product, currentImage, loading } = this.state;
    const carouselImages = product.images.map((image, index) => (
      <div onClick={() => this.changeImage(image)} key={index}>
        <Avatar
          className="product__carousel"
          shape="square"
          size="large"
          src={image}
        />
      </div>
    ));
    return (
      <div className="product">
        {product._id !== "" && !loading ? (
          <Row>
            <Col span={10}>
              <div className="product__current-img">
                <img
                  alt={product.name}
                  src={currentImage}
                  className="product__current-img__img"
                />
              </div>
              <Row>{carouselImages}</Row>
            </Col>
            <Col span={14} className="product__desc">
              <Row>
                <h2 className="product__desc__name">{product.name}</h2>
              </Row>
              <Row>
                <h3>Цена: {product.price}р.</h3>
              </Row>
              <Row>
                <Buy product={product} />
              </Row>
              <Row>
                <h5>Товаров в наличии: {product.count}</h5>
              </Row>
              <Row>{product.description}</Row>
            </Col>
          </Row>
        ) : (
          <Error404 />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = { setPath };

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(MainProduct)
);
