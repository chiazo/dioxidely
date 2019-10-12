// Dummy profile data for demo purposes
import { ProfileORM, sequelize } from "../db/sequelize";

const firstNames = ["Bob", "Alice", "Grommet", "Harry", "Haley", "Valerie", "Vince", "Amy", "Barbara", "Zarah", "Vematre", "Kwicsake"];
const lastNames = ["Plumber", "Alien", "Mafia", "Good", "Doofenschmirz", "Developer", "Jokester"];

async function createDummyProfile(firstNamesList: string[], lastNamesList: string[]) {
    const firstName: string = firstNamesList[Math.floor(Math.random() * firstNamesList.length)];
    const lastName: string = lastNamesList[Math.floor(Math.random() * lastNamesList.length)];

    ProfileORM.create({
        firstName,
        lastName,
        currentPointBalance: Math.floor(Math.random() * 100),
    }).then((prof) => {
        console.log(`Created profile with id: ${prof.id}`);
    }).catch((err) => {
        console.log(`Error creating profile: ${err}`);
    });
}

const numProfilesToGenerate = 15;

for (let i = 0; i < numProfilesToGenerate; i++) {
    createDummyProfile(firstNames, lastNames);
}

console.log(`${numProfilesToGenerate} profiles were attempted to be created.`);
