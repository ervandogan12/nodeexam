import jwt from "jsonwebtoken";
import { v4 as generateUUID } from "uuid";
import userDB from "./usersController.js";

let itemsDB = [
  {
    id: "string",
    title: "string",
    sellerEmail: "string",
    price: 12.34,
  },
];
const JWT_SECRET = "my_mock_jwt_secret_key";

export const getMyItems = async (req, res) => {
  const decodedUserId = authenticate(req, res);
  const user = userDB.find((user) => user.id === decodedUserId);
  const userItems = itemsDB.filter((item) => item.sellerEmail === user.email);
  res.status(200).json(userItems);
};
export const searchItems = async (req, res) => {
  const keyword = req.query.query;

  console.log(keyword);

  if (!keyword) {
    return res.status(200).json(itemsDB);
  }

  const filteredItems = itemsDB.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase())
  );

  res.status(200).json(filteredItems);
};

export const createItem = async (req, res) => {
  const { title, price } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Title and price are required." });
  }

  if (title.length < 3) {
    return res
      .status(400)
      .json({ error: "Title must be at least 3 characters long." });
  }

  if (typeof price !== "number" || isNaN(price)) {
    return res.status(400).json({ error: "Price must be a number." });
  }

  if (price <= 0 || price >= 10000) {
    return res
      .status(400)
      .json({ error: "Price must be greater than 0 and less than 10000." });
  }

  const itemId = generateUUID();
  const decodedUserId = authenticate(req, res);

  const user = userDB.find((user) => user.id === decodedUserId);

  itemsDB.push({ id: itemId, title, sellerEmail: user.email, price });

  res.status(201).json({ id: itemId, title, sellerEmail: user.email, price });
};

export const updateItem = async (req, res) => {
  const itemId = req.params.id;
  const { title, price } = req.body;

  const itemIndex = itemsDB.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }
  const decodedUserId = authenticate(req, res);

  const user = userDB.find((user) => user.id === decodedUserId);

  if (itemsDB[itemIndex].sellerEmail !== user.email) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this item." });
  }

  if (!title || !price) {
    return res.status(400).json({ error: "Title and price are required." });
  }

  if (title.length < 3) {
    return res
      .status(400)
      .json({ error: "Title must be at least 3 characters long." });
  }

  if (typeof price !== "number" || isNaN(price)) {
    return res.status(400).json({ error: "Price must be a number." });
  }

  if (price <= 0 || price >= 10000) {
    return res
      .status(400)
      .json({ error: "Price must be greater than 0 and less than 10000." });
  }

  itemsDB[itemIndex].title = title;
  itemsDB[itemIndex].price = price;

  res.status(200).json(itemsDB[itemIndex]);
};

export const deleteItem = async (req, res) => {
  const itemId = req.params.id;

  // Check if item exists
  const itemIndex = itemsDB.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found." });
  }

  // Check if the logged-in user is the seller of the item
  const decodedUserId = authenticate(req, res);

  const user = userDB.find((user) => user.id === decodedUserId);
  if (itemsDB[itemIndex].sellerEmail !== user.email) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this item." });
  }

  // Delete item from the database
  itemsDB.splice(itemIndex, 1);

  // Respond with empty body
  res.status(204).send();
};
//helper functions
function authenticate(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    console.log(decoded.userId);
    return decoded.userId;
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default itemsDB;
