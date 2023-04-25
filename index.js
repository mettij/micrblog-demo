const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
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
// run the app on the provided port
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
