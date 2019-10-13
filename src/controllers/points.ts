import express, { response } from "express";
import passport from "passport";
import request from "request";
import { INTEGER } from "sequelize/types";
import { ProfileORM, sequelize, UserORM } from "../db/sequelize";
import { Profile } from "../models/profiles";
import { User } from "../models/users";

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

router.post("/getBalance", passport.authenticate("authtoken", { session: false }), (req, res) => {
    const user = req.user as User;

    console.log(`User Id: ${user.id}`);

    // Get data from db
    ProfileORM.findOne({
        where: {
            linkedUserId: user.id,
        },
    }).then((profile) => {
        res.send({
            pointBalance: profile.currentPointBalance,
        });
    }).catch((err) => {
        res.send(err);
    });
});

router.post("/addToBalance", passport.authenticate("authtoken", { session: false }), (req, res) => {
    const user = req.user as User;

    // const profId: number = Number(req.query.profileId);
    const addition: number = 10;

    ProfileORM.findOne({
        where: {
            linkedUserId: user.id,
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

router.post("/subtractFromBalance", passport.authenticate("authtoken", { session: false }), (req, res) => {
    const user = req.user as User;

    // const profId: number = Number(req.query.profileId);
    const subtraction: number = 10;
    // console.log(profId);

    ProfileORM.findOne({
        where: {
            linkedUserId: user.id,
        },
    }).then((profile) => {
        profile.currentPointBalance -= subtraction;
        if (profile.currentPointBalance < 0) {
            profile.currentPointBalance = 0;
        }
        profile.save();
        res.send({
            pointBalance: profile.currentPointBalance,
        });
    }).catch((err) => {
        res.send(err);
    });
});

export default router;
