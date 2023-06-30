var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import bodyParser from 'body-parser';
// const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
// import * db from './queries.js';
// const db = require("./queries");
import * as db from './queries.js';
const port = 3000;
// parse request bodies in middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.users.create({
            data: {
                handle: 'Lets double check',
                displayname: '@seems legit',
                posts: {
                    create: {
                        content: 'god i wish',
                        time: new Date(),
                    },
                },
            },
        });
        const allUsers = yield prisma.users.findMany({
            include: { posts: true },
        });
        console.dir(allUsers, { depth: null });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
// run the app on the provided port
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
