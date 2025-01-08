// import type { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log(req.method)
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed!!!!!!!!!!!!!!!" });
//   }

//   const { email, password, username } = req.body;

//   if (!email || !password || !username) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     // Check if the user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the user in the database
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         username,
//       },
//     });

//     return res.status(201).json({ message: "User created successfully.", user: newUser });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error.", error });
//   }
// }


import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, username } = await req.json();

  if (!email || !password || !username) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return NextResponse.json({ message: "User created successfully.", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error.", error }, { status: 500 });
  }
}

