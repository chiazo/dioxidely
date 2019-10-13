import bodyParser = require("body-parser");
import express = require("express");
import session = require("express-session");
import passport = require("passport");
import path from "path";
import index from "./controllers/index";
import marketplace from "./controllers/marketplace";
import points from "./controllers/points";

import passport_local = require("passport-local");
const LocalStrategy = passport_local.Strategy;

import { passport_strategy } from "./config/passport/passport";

import { User } from "./models/users";
import { UserORM } from "./db/sequelize";

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

passport.serializeUser((user: UserORM, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: number, done) => {

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
