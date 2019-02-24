import express = require("express");
import Categories from "../models/categories";
import { checkToken, queryToObj } from "../utils";
import * as _c from "../types/categories";

const router = express.Router();

router.get(
  "/get",
  async (req, res): Promise<express.Response> => {
    try {
      const categories = await Categories.GetFullArrayTree();
      if (!categories) return res.sendStatus(404);
      return res.status(200).send({ categories });
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
      if (!_c.isNewCategory(data)) return res.sendStatus(400);
      const { name, parentID } = data;
      const parentCategory = await Categories.findById(parentID);
      if (parentID && !parentCategory) return res.sendStatus(404);
      const newCategory = new Categories({ name });
      const savedCategory = await newCategory.save();
      if (!savedCategory) return res.sendStatus(500);
      const savedParentCategory =
        parentCategory && (await parentCategory.appendChild(savedCategory));
      if (parentID && !savedParentCategory) return res.sendStatus(500);
      const categories = await Categories.GetFullArrayTree();
      if (!categories) return res.sendStatus(404);
      return res.status(200).send({ categories });
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
      if (!_c.isEditedCategory(data)) return res.sendStatus(400);
      const { id, name } = data;
      let category = await Categories.findById(id);
      if (!category) return res.sendStatus(404);
      category.name = name;
      const savedCategory = await category.save();
      if (!savedCategory) return res.sendStatus(500);
      const categories = await Categories.GetFullArrayTree();
      if (!categories) return res.sendStatus(404);
      return res.status(200).send({ categories });
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
      if (!_c.isRemovedCategory(data)) return res.sendStatus(400);
      const { id } = data;
      const category = await Categories.findById(id);
      if (!category) return res.sendStatus(404);
      const removedCategory = category.remove();
      if (!removedCategory) return res.sendStatus(500);
      const categories = await Categories.GetFullArrayTree();
      if (!categories) return res.sendStatus(404);
      return res.status(200).send({ categories });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

export const categories = router;
