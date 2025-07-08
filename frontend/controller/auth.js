// controllers/auth.js
import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register a new user
export const register = (req, res) => {
  const checkQuery = "SELECT * FROM users WHERE username = ?";

  db.query(checkQuery, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQuery = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(insertQuery, [values], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

// ✅ Login user and send JWT in cookie
export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  console.log(req.body.username)
  db.query(q, [req.body.username], (err, data) => {
    console.log(err)
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey", { expiresIn: "1d" });
    const { password, ...userWithoutPassword } = data[0];

    res
  .cookie("accessToken", token, {
    httpOnly: true,
    secure: true,       
    sameSite: "None",     
  })
  .status(200)
  .json(userWithoutPassword);

  });
};

export const logout = (req, res) => {
 res
  .clearCookie("accessToken", {
    httpOnly: true,
    secure: true,        
    sameSite: "None",    
  })
  .status(200)
  .json("User has been logged out.");
};
