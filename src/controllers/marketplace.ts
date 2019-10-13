import express, { response } from "express";
import request from "request";
import { INTEGER } from "sequelize/types";
import { ProfileORM, sequelize } from "../db/sequelize";
import { Profile } from "../models/profiles";
import { EmissionTransaction } from "../models/emissiontransactions";

const router = express.Router();

// json: one field is description and one is enum
class Category {
    public name: string;
    public fullName: string;
    public description: string; // include country
    public costPerTonne: number;

    constructor(name: string, fullName: string, description: string, costPerTonne: number) {
        this.name = name;
        this.description = description;
        this.costPerTonne = costPerTonne;
    }
}
const categories: Category[] = [
    new Category("TREES", "Seeing the Forest for the Trees", "Turning forest destruction to forest regeneration - MEXICO", 714),
    new Category("ORANGUTANS", "Economics of Orangutans", "Protect endangered Bornean Orangutans - INDONESIA", 659),
    new Category("FOREST","Jacundá Forest Reserve", "Saving rubber trees to reduce carbon and help indigenous communities - BRAZIL", 330),
    new Category("TRICITY","Tri-City Forest Project", "Protecting nature's resources - MASSACHUSETTS", 1098),
    new Category("MIRADOR","Mirador Clean Cookstoves", "Hola Honduras! Hola Healthy Air! - HONDURAS", 850),
    new Category("BEARADISE","A BEARADISE", "Making sure carbon-reducing trees don’t disappear. - ALASKA", 769),
    new Category("BIRDS","BIRDS' SANCTUARY", "Wildlife conservation and education - SOUTH CAROLINA", 989),
];

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

// buying carbon emission offsets
// check if user has enough points
// subtract points from their account
// add new table of emissions purchased; have a message saying successful
// table = offset transatcions
// column of userId & we can query it on request to get their total
// 2 posts: one to buy and one to get purchase

/**
 * parameters:
 * category: string = {}
 * units: number // it's tonnes of kgCO2e
 *
 */
router.post("/buyCarbonOffsets", (req, res) => {
    const userCategory = req.body.category;

    const profId: number = Number(req.query.profileId);

    ProfileORM.findOne({
        where: {
            id: profId,
        },

    }).
    then((profile) => {
        categories.forEach((name) => {
            if (name === userCategory) {
                if (profile.currentPointBalance >= 50) {
                    profile.currentPointBalance -= 50;
                    profile.save();
                    // update emission transactions; create new 
                    EmissionTransaction.build({
                        date: new Date(),
                        units: req.body.units, 
                        profId: req.body.profId
                    }).save();
                    // remember to update daily emissions 

                    res.send({
                        pointBalance: profile.currentPointBalance,
                    });
                }
            } else {
                res.sendStatus(400).send("Invalid Input");
            }
        });

    }).catch((err) => {
        res.send(err);
    });
});

router.get("/viewCarbonOffsets", (req, res) => {
    const profId: number = Number(req.query.profileId);
    let totalOffsets: number = 0;

    EmissionTransaction.findOne({
        where: {
            id: profId,
        },

    }).
    then((emission) => {
        totalOffsets += emission.units;
        res.send({
            offSetAmount: totalOffsets,
        });
    }).catch((err) => {
        res.send(err);
    });

    res.send();
});

router.get("/availableCategories", (req, res) => {
    res.send(categories);
});

export default router;
