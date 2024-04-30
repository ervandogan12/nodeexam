import express from "express";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// TODO: add other routers...

export default app;
