import bodyParser = require("body-parser");
import express = require("express");
import session = require("express-session");
import passport = require("passport");
import path from "path";
import index from "./controllers/index";
import marketplace from "./controllers/marketplace";
import points from "./controllers/points";

import passport_local = require("passport-local");
// import passport_authToken
const LocalStrategy = passport_local.Strategy;

import passport_authToken = require("passport-auth-token");
const AuthTokenStrategy = passport_authToken.Strategy;

import bcrypt = require("bcrypt-nodejs");

import { passport_strategy } from "./config/passport/passport";

import { UserORM } from "./db/sequelize";
import { User } from "./models/users";

const app = express();

/**
 * Express Middleware Configuration
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// app.use(express.static("/views"));
app.use("/static", express.static(path.join( __dirname, "static" )));

// Passport Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
app.use(session({ secret: "hi im from cary", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(
//     function(email, password, done) {

//     },
// ));

passport.use("authtoken", new AuthTokenStrategy(
    (token, done) => {
        console.log("Attempting to search for user by auth token...");
        UserORM.findOne({
            where: {
                authToken: token,
            },
        }).then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }).catch((err) => {
            return done("Error!" + err);
        });
    },
));

passport.serializeUser((user: UserORM, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
    UserORM.findOne({
        where: {
            id,
        },
    }).then((user: UserORM) => {
        return user;
    }).catch((err) => {
        return null;
    });
});

/**
 * API Routes
 */
app.use("/", index);
app.use("/points", points);
app.use("/marketplace", marketplace);

app.get("/", (req, res) => {
    res.render("index.ejs", {name: ""});
});

export { app };
