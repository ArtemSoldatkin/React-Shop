import React, { memo } from "react";
import { Col } from "antd";
import { Link } from "react-router-dom";
import Buy from "../buy";
import { Product } from "../../../models/product";
import "./catalog.less";

interface CmpProps {
  product: Product;
}

const getRandomImage = (length: number): number =>
  Math.floor(Math.random() * length);

const CatalogProduct = memo(({ product }: CmpProps) => (
  <Col span={6} className="catalog-product">
    <div className="catalog-product__content">
      <Link to={`/product/${product._id}`}>
        <div className="catalog-product__content__current-img">
          {product.images.length > 0 && (
            <img
              className="catalog-product__content__current-img__img"
              alt={product.name}
              src={product.images[getRandomImage(product.images.length)]}
            />
          )}
        </div>
        <div className="catalog-product__content__name">
          <h2>{product.name}</h2>
        </div>
        <div className="catalog-product__content__price">
          <h1>{product.price} Р</h1>
        </div>
      </Link>
      <div className="catalog-product__content__buy">
        <Buy product={product} />
      </div>
      <div className="catalog-product__content__in-stock">
        Товаров в наличии: {product.count}
      </div>
    </div>
  </Col>
));

export default CatalogProduct;
