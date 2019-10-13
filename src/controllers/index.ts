import bcrypt = require("bcrypt-nodejs");
import crypto = require("crypto");
import express, { response } from "express";
import passport = require("passport");
import request from "request";
import { ProfileORM, sequelize, UserORM } from "../db/sequelize";

const router = express.Router();

// Token generator function
function generateAuthToken() {
    const buffer = crypto.randomBytes(48);
    return buffer.toString("hex");
}

// req, res
router.get("/helloworld", (req, res) => {
    const name = "hello world";
    // send a json obj
    res.send(name);
});

router.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    UserORM.build({
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
        authToken: generateAuthToken(),
    }).save()
    .then((builtUser) => {
        // Build corresponding profile
        ProfileORM.build({
            linkedUserId: builtUser.id,
            currentPointBalance: 100,
            firstName,
            lastName,
        })
        .save();
        res.send(builtUser);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    UserORM.findOne({
        where: {
            email,
        },
    }).then((user) => {
       if (!user) {
        res.status(400).send({ message: "Incorrect username." });
       }
       bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                res.status(400).send({ message: "Incorrect password." });
            }
            if (err) {
                res.status(500).send({ message: err });
            }
       });

        // Generate token and save
       const newToken = generateAuthToken();
       user.authToken = newToken;
       user.save();

       // Check if profile exists
       ProfileORM.findOne({
           where: {
               linkedUserId: user.id,
           },
       }).then((profile) => {
           if (!profile) {
               console.log("Profile does not exist! Creating now w/ 100 pts");
                // Build corresponding profile
               ProfileORM.build({
                    firstName: "",
                    lastName: "",
                    linkedUserId: user.id,
                    currentPointBalance: 100,
                })
                .save();
           }
       });

       res.send({ email: user.email, authToken: user.authToken });
    }).catch((err) => {
        res.status(500).send({ message: err });
    });
});

router.post("/testAuthToken", passport.authenticate("authtoken", { session: false }), (req, res) => {
    console.log("Request made to test auth token");
    res.send(
        {
            message: "Auth success!",
            user: req.user,
        });
});

export default router;
