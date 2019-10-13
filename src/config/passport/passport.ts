import bcrypt = require("bcrypt-nodejs");

import { PassportStatic } from "passport";
// import { seequ } from "../../models/users";
import { sequelize, UserORM } from "../../db/sequelize";

function localPassportStrategy(passport: PassportStatic, user: UserORM) {
    const User = user;
    const LocalStrategy = require("passport-local").Strategy;

    passport.use("local-signup", new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },

        (req, email, password, done) => {
            UserORM.findOne({
                where: {
                    email: email
                }
            }).then(user => {
                if (user) {
                    return done(null, false, {
                        message: 'An account already exists with this email address!'
                    });
                } else {
                    let userPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                    let data = {
                        email: email,
                        password: userPassword,
                    };

                    UserORM.build(data)
                        .save()
                        .then(user => { return done(null, user) })
                        .catch(err => { return done(null, false) });
                }
            })
        },
    ));
}

export { localPassportStrategy as passport_strategy }