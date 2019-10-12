import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../db/sequelize";

class User extends Model {
    public id!: number;
    public email: string;
    public password: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export { User as User };
