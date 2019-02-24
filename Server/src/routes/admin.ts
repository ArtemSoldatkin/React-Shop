import express = require("express");
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");
import Admin from "../models/admin";
import { checkToken, secret, isString, queryToObj } from "../utils";
import * as _u from "../types/user";

const router = express.Router();

router.post(
  "/login",
  async (req, res): Promise<express.Response> => {
    try {
      const data = req.body;
      if (!_u.isUser(data)) return res.sendStatus(400);
      const { login, password } = data;
      const user = await Admin.findOne({ login });
      if (!_u.isUser(user)) return res.sendStatus(404);
      const result = await bcrypt.compare(password, user.password);
      if (!result) return res.sendStatus(401);
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });
      if (!isString(token)) return res.sendStatus(500);
      return res.status(202).send({ token });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  "/check",
  async (req, res): Promise<express.Response> => {
    try {
      const data = req.body;
      if (!_u.isInputToken(data)) return res.sendStatus(400);
      const { token } = data;
      const result = jwt.verify(token, secret);
      if (!result) return res.sendStatus(401);
      return res.status(200).send({ result: true });
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
      if (!_u.isUser(data)) return res.sendStatus(400);
      const { login, password } = data;
      const hash = await bcrypt.hash(password, 8);
      if (!isString(hash)) return res.sendStatus(500);
      const user = new Admin({ login, password: hash });
      const savedUser = user.save();
      if (!savedUser) return res.sendStatus(500);
      return res.sendStatus(201);
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
      let data = req.body;
      if (!_u.isEditedUser(data)) return res.sendStatus(400);
      const { id } = data;
      const EditedData = delete data.id;
      const updatedUser = await Admin.findByIdAndUpdate(id, EditedData);
      if (!updatedUser) return res.sendStatus(404);
      return res.sendStatus(200);
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
      if (!_u.isUserID(data)) return res.sendStatus(400);
      const { id } = data;
      const removedUser = await Admin.findByIdAndDelete(id);
      if (!removedUser) return res.sendStatus(404);
      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
);

export const admin = router;
