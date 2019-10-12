import express, { response } from "express";
import request from "request";
import { INTEGER } from "sequelize/types";
import { Profile } from "../models/profiles";
// import { sequelize } from "../db/sequelize";

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

const dummyData = {
   1: {
       name: "Chiazo",
       pointBalance: 100,
   },
   2: {
       name: "Visrut",
       pointBalance: 200,
   },
};

router.get("/getBalanceById", (req, res) => {
    const profId: number = Number(req.query.profileId);
    console.log(profId);
    const profPoints: number = dummyData[profId].pointBalance;
    console.log(profPoints);
    res.send(profPoints.toString());
});

router.get("/addToBalanceById", (req, res) => {
    const profId: number = Number(req.query.profileId);
    const addition: number = 10;
    console.log(profId);
    const prof = dummyData[profId];
    const profPoints: number = dummyData[profId].pointBalance + addition;
    prof.pointBalance += addition;
    console.log(profPoints);
    res.send(profPoints.toString());
});

router.get("/subtractFromBalanceById", (req, res) => {
    const profId: number = Number(req.query.profileId);
    const subtraction: number = 10;
    console.log(profId);
    const prof = dummyData[profId];
    const profPoints: number = dummyData[profId].pointBalance;
    prof.pointBalance -= subtraction;
    if (profPoints < 0) {
        prof.pointBalance = 0;
    }
    console.log(profPoints);
    res.send(profPoints.toString());
});

export default router;
