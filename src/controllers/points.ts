import express, { response } from "express";
import request from "request";
import { INTEGER } from "sequelize/types";
import { ProfileORM, sequelize } from "../db/sequelize";
import { Profile } from "../models/profiles";

const router = express.Router();

// req, res
router.get("/helloworld", (req, res) => {
    const name = "hello world";
    // send a json obj
    res.send(name);
});

/* What does our backend need to do
- Points:
    - get points by user => returns a integer of total points
    - add points by user => return new integer total
    - subtract points by user => return new integer total

-

*/

router.get("/getBalanceById", (req, res) => {
    const profId: number = Number(req.query.profileId);

    // Get data from db
    ProfileORM.findOne({
        where: {
            id: profId,
        },
    }).then((profile) => {
        res.send({
            pointBalance: profile.currentPointBalance,
        });
    }).catch((err) => {
        res.send(err);
    });
});

router.get("/addToBalanceById", (req, res) => {

    const profId: number = Number(req.query.profileId);
    const addition: number = 10;

    ProfileORM.findOne({
        where: {
            id: profId,
        },

    }).
    then((profile) => {
        profile.currentPointBalance += addition;
        profile.save();
        res.send({
            pointBalance: profile.currentPointBalance,
        });
    }).catch((err) => {
        res.send(err);
    });
});

router.get("/subtractFromBalanceById", (req, res) => {
    const profId: number = Number(req.query.profileId);
    const subtraction: number = 10;
    console.log(profId);

    ProfileORM.findOne({
        where: {
            id: profId,
        },
    }).then((profile) => {
        profile.currentPointBalance -= subtraction;
        profile.save();
        res.send({
            pointBalance: profile.currentPointBalance,
        });
    }).catch((err) => {
        res.send(err);
    });
});

export default router;
