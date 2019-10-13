import bcrypt = require("bcrypt-nodejs");

import { PassportStatic } from "passport";
// import { seequ } from "../../models/users";
import { sequelize, UserORM } from "../../db/sequelize";

function localPassportStrategy(passport: PassportStatic, userObj: UserORM) {
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
                    email,
                },
            }).then((user) => {
                if (user) {
                    return done(null, false, {
                        message: "An account already exists with this email address!",
                    });
                } else {
                    const userPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                    const data = {
                        email,
                        password: userPassword,
                    };

                    UserORM.build(data)
                        .save()
                        .then((builtUser) => done(null, builtUser))
                        .catch((err) => done(null, false));
                }
            });
        },
    ));
}

export { localPassportStrategy as passport_strategy };
