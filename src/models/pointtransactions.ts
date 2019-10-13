import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../db/sequelize";

class PointTransactions extends Model {
    public date: Date;
    public numberOfPointsEarned: number;
    public numberOfPointsLost: number;
    public profileId: number;
    public category: string;
    // public kgCO2eTotal: number;
    // travel: number;
    // appliances: number;
    // climate: number;
}
export { PointTransactions };
