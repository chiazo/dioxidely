import dotenv from "dotenv";
import { DataTypes, Sequelize } from "sequelize";

import { EmissionTransaction } from "../models/emissiontransactions";
import { PointTransactions } from "../models/pointtransactions";
import { Profile } from "../models/profiles";
import { User } from "../models/users";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialect: "postgres",
        dialectOptions: {
            ssl: true,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
    });

/**
 * Init models
 */

Profile.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        // require: true,
        primaryKey: true,
    },
    linkedUserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        // allowNull: false,
    },
    // TODO: Consider names in an internationalization context.
    firstName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        // require: true,
        unique: false,
    },
    lastName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        // require: true,
        unique: false,
    },
    bio: {
        type: new DataTypes.STRING(1024),
        // allowNull: true,
        // require: false,
        unique: false,
    },
    imageUrl: {
        type: new DataTypes.STRING(256),
        // allowNull: true,
        // require: false,
        unique: false,
    },
    currentPointBalance: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
}, {
    tableName: "profiles",
    sequelize,
});

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: new DataTypes.STRING(256),
        unique: true,
    },
    password: {
        type: new DataTypes.STRING(512),
        allowNull: false,
    },
    authToken: {
        type: new DataTypes.STRING(512),
    },
}, {
    tableName: "users",
    sequelize,
});

PointTransactions.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    pointsGained: {
        type: new DataTypes.INTEGER(),
    },
    pointsLost: {
        type: new DataTypes.INTEGER(),
    },
    category: {
        type: new DataTypes.STRING(256),
        allowNull: false,
    },
    date: {
        type: new DataTypes.DATE(6),
        allowNull: false,
    },
}, {
    tableName: "transactions",
    sequelize,
});

EmissionTransaction.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: new DataTypes.DATE(6),
        allowNull: false,
    },
    units: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    profileId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    tableName: "emissions",
    sequelize,
});

// sequelize.profiles = Profiles.init_table(sequelize);
sequelize.sync({ alter: true }).then(() => {
    console.log("DB Models synchronized.");
});

/**
 * Define Relationships
 */

// Export modules
export { sequelize };
export { Profile as ProfileORM };
export { User as UserORM };
export { EmissionTransaction as EmissionTransactionORM };
