import bodyParser = require("body-parser");
import express = require("express");
import path from "path";
import index from "./controllers/index";
import marketplace from "./controllers/marketplace";
import points from "./controllers/points";

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
