import bcrypt from "bcrypt";
import { v4 as generateUUID } from "uuid";
import jwt from "jsonwebtoken";


const userDB = [{ id: "string", email: "string", password: "string" }];
const JWT_SECRET = "my_mock_jwt_secret_key";

export const addUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
}

if (email.length < 3 || !email.includes('@')) {
  return res.status(400).json({ error: "Invalid email format." });
}

if (password.length < 8) {
  return res.status(400).json({ error: "Password must be at least 8 characters long." });
}
const existingUser = userDB.find(user => user.email === email);
if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists." });
}
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }
    const user = { id: generateUUID(), email, password: hash };
    userDB.push(user);
    res.json({
      id: user.id,
      email: user.email,
    });
  });
};

export const login = async (req, res) => {

  const { email, password } = req.body;
  if (!email|| !password) {
    res.status(400).json({ message: "Please provide an email and password" }).end();
    return;
  }

 
  const user = userDB.find(user => user.email === email);
  console.log(user.email)
  if (!user.email) {
    res
      .status(401)
      .json({ message: "Invalid username / password combination" })
      .end();
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) {
    res
      .status(401)
      .json({ message: "Invalid username / password combination" })
      .end();
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // Return the token to the client
  res.status(200).json({ token }).end();
};

export default userDB;