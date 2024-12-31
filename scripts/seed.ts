// const { PrismaClient } = require("@prisma/client")

// const database = new PrismaClient();

// async function main() {
//     try {
//         await database.category.createMany({
//         data: [
//             { name: "Computer Science"},
//             { name: "Mathematics"},
//             { name: "Biology"},
//             { name: "Engineering"},
//             { name: "Accounting"},
//             { name: "Filming"},
//         ]
//     });
//     } catch (error) {
//         console.log("Error Sending the database categories", error)
//     } finally {
//         await database.$disconnect()
//     }
// }

// main();



const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    // Clear existing categories (optional)
    await database.category.deleteMany(); 

    // Insert categories and skip duplicates
    await database.category.createMany({
      data: [
        { name: "Music" },
        { name: "Photography" },
        { name: "Fitness" },
        { name: "Accounting" },
        { name: "Computer Science" },
        { name: "Filming" },
        { name: "Engineering" },
        
        
      ],
      skipDuplicates: true, // Avoid errors due to duplicates
    });

    console.log("Categories seeded successfully");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
