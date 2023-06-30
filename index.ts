import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import express from 'express';
import bodyParser from 'body-parser';

// const express = require("express");
// const bodyParser = require("body-parser");

const app = express();
// import * db from './queries.js';
// const db = require("./queries");
import * as db from './queries.js';
const port: number = 3000;

// parse request bodies in middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// add static pages for temporary frontend
app.use(express.static("public"));

// add user queries
app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);

// add post queries
app.get("/posts", db.getPosts);
app.get("/posts/:userID", db.getPostsByUser);
app.post("/posts", db.createPost);
app.delete("/posts", db.deletePost);


async function main() {
    await prisma.users.create({
        data: {
            handle: '@justinmetti',
            displayname: 'justin metti',
            posts: {
                create: {
                    content: 'I sure hope no one tries to steal my handle',
                    time: new Date(),
                 },
            },
         },
    })

    const allUsers = await prisma.users.findMany({
        include: { posts: true },
    })
    console.dir(allUsers, { depth: null })

}



main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

  // run the app on the provided port
app.listen(port, () => {
    console.log(`App running on port ${port}`);
  })
  