import express = require("express");
import Products from "../models/products";
import { checkToken, queryToObj } from "../utils";
import Categories, { CategoriesModel } from "../models/categories";
import * as _p from "../types/products";

const router = express.Router();

const getByCategory = async (
  categoryID: string,
  searchRegExp: RegExp
): Promise<_p.Products | undefined> => {
  try {
    const category = await Categories.findById(categoryID).populate("products");
    if (!category) return undefined;
    const products = category.products.filter(
      product =>
        product.name.search(searchRegExp) !== -1 ||
        product.description.search(searchRegExp) !== -1
    );
    if (!products) return;
    return products;
  } catch (err) {
    return undefined;
  }
};

const getBySearch = async (
  searchRegExp: RegExp
): Promise<_p.Products | undefined> => {
  try {
    const products = await Products.find({
      $or: [{ name: searchRegExp }, { description: searchRegExp }]
    });
    if (!products) return undefined;
    return products;
  } catch (err) {
    return undefined;
  }
};

const saveInAncestors = async (
  ancestors: CategoriesModel[],
  path: _p.Path,
  id: string
): Promise<boolean> => {
  try {
    ancestors.map(async parent => {
      if (!parent) return;
      path.push({ id: parent._id, name: parent.name });
      parent.products.push(id);
      await parent.save();
    });
    return true;
  } catch (err) {
    return false;
  }
};

router.get(
  "/get",
  async (req, res): Promise<express.Response> => {
    try {
      const products = await Products.find();
      if (!products) return res.sendStatus(404);
      return res.status(200).send({ products, count: products.length });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  "/get-by-param",
  async (req, res): Promise<express.Response> => {
    try {
      const data = req.body;
      if (!_p.isProductsProps(data)) return res.sendStatus(400);
      const { categoryID, search } = data;
      const searchRegExp = search
        ? new RegExp(search.trim(), "i")
        : new RegExp("", "i");
      const products = categoryID
        ? await getByCategory(categoryID, searchRegExp)
        : await getBySearch(searchRegExp);
      if (!products) return res.sendStatus(404);
      return res.status(200).send({ products, count: products.length });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  "/get-one",
  async (req, res): Promise<express.Response> => {
    try {
      const data = req.body;
      if (!_p.isProductID(data)) return res.sendStatus(400);
      const { id } = data;
      const product = await Products.findById(id);
      if (!product) return res.sendStatus(404);
      return res.status(200).send({ product });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.put(
  "/add",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const data = req.body;
      if (!_p.isNewProduct(data)) return res.sendStatus(400);
      const { categoryID } = data;
      const category = await Categories.findById(categoryID);
      if (!category) return res.sendStatus(404);
      const ancestors = await category.getAncestors();
      let path: _p.Path = [];
      const { name, price, count, description, images } = data;
      const product = new Products({
        name,
        price,
        count,
        description,
        images,
        path
      });
      const savedProduct = await product.save();
      if (!savedProduct) return res.sendStatus(500);
      category.products.push(savedProduct._id);
      const savedCategory = await category.save();
      if (!savedCategory) return res.sendStatus(500);
      const savedAncestors =
        ancestors && (await saveInAncestors(ancestors, path, savedProduct._id));
      if (ancestors && !savedAncestors) return res.sendStatus(500);
      product.path = path;
      const newSavedProduct = product.save();
      if (!newSavedProduct) return res.sendStatus(500);
      const products = await Products.find();
      if (!products) return res.sendStatus(201);
      return res.status(201).send({ products, count: products.length });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.put(
  "/edit",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const data = req.body;
      if (!_p.isEditedProduct(data)) return res.sendStatus(400);
      const { id } = data;
      const updatedData = delete data.id;
      const product = await Products.findByIdAndUpdate(id, updatedData);
      if (!product) return res.sendStatus(404);
      const products = await Products.find();
      if (!products) return res.sendStatus(200);
      return res.status(200).send({ products, count: products.length });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.delete(
  "/remove",
  async (req, res): Promise<express.Response> => {
    try {
      const isAuth = await checkToken(req);
      if (!isAuth) return res.sendStatus(401);
      const data = req.query;
      if (!_p.isProductID(data)) return res.sendStatus(400);
      const { id } = data;
      const product = await Products.findByIdAndDelete(id);
      if (!product) return res.sendStatus(404);
      const categories = await Categories.updateMany(
        { products: id },
        { $pullAll: { products: [id] } }
      );
      if (!categories) return res.sendStatus(404);
      const products = await Products.find();
      if (!products) return res.sendStatus(200);
      return res.status(200).send({ products, count: products.length });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

export const products = router;
