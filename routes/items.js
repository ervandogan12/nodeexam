import express from "express";
import { getMyItems, createItem, updateItem, deleteItem, searchItems } from "../controllers/itemsController.js";
const itemsRouter = express.Router();


itemsRouter.post("", createItem);
itemsRouter.get("", getMyItems);
itemsRouter.get("/search", searchItems);
itemsRouter.put("/:id", updateItem);
itemsRouter.delete("/:id", deleteItem);
export default itemsRouter;
