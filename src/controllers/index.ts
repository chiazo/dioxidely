import express from "express";
import request from "request";
import { sequelize } from "../db/sequelize";

const router = express.Router();

router.get("/testdb", (req, res) => {
    sequelize.authenticate()
    .then(() => {
        res.send("DB Connection Test Success!");
    })
    .catch((err) => {
        res.send(`ERROR: DB connection failed!<br>${err}`);
    });
});

export default router;
