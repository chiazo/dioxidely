import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../db/sequelize";

class EmissionTransaction extends Model {
    public date: Date;
    public units: number;   // Units measured in Tonnes of KgCO2E
    public profileId: number;
}

export { EmissionTransaction };