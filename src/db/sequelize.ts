import dotenv from "dotenv";
import { DataTypes, Sequelize } from "sequelize";

import { Profile } from "../models/profiles";
import { User } from "../models/users";
import { PointTransactions } from "../models/pointtransactions"

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
        type: new DataTypes.INTEGER,
    },
    pointsLost: {
        type: new DataTypes.INTEGER,
    },
    category: {
        type: new DataTypes.STRING(256),
        allowNull: false,
    },
    date: {
        type: new DataTypes.DATE(6),
        allowNull: false,
    }
}, {
    tableName: "transactions",
    sequelize,
});

// sequelize.profiles = Profiles.init_table(sequelize);
sequelize.sync().then(() => {
    console.log("DB Models synchronized.");
});

/**
 * Define Relationships
 */

// Export modules
export { sequelize };
export { Profile as ProfileORM };
