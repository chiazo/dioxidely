import express, { response } from "express";
import request from "request";
// import { sequelize } from "../db/sequelize";

const router = express.Router();

// req, res
router.get("/helloworld", (req, res) => {
    const name = "hello world";
    // send a json obj
    res.send(name);
});

export default router;
