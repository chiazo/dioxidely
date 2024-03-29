import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../db/sequelize";

class Profile extends Model {
    public id!: number;
    public linkedUserId: number;
    public firstName!: string;
    public lastName!: string;
    public bio: string;
    public imageUrl: string;

    public currentPointBalance: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export { Profile };
