import express from "express";
import { login,register, logout} from "../controller/auth.js";


const router = express.Router()
console.log("i am in auth route")
router.post("/login", login)
router.post("/register",register)
router.post("/logout",logout)

console.log(logout);


export default router;