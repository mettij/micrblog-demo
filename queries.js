// database login info
// TODO: move this to .env
const Pool = require("pg").Pool;
const pool = new Pool({
    user: "metti",
    host: "localhost",
    database: "microblog",
    password: "demo",
    port: 5432
});
/* Queries regarding user creation/deletion/access
 */
// get all users in the database
const getUsers = (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// get info on the user with the specified id
const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// create a new user with the given handle and display name
const createUser = (req, res) => {
    const { handle, displayName } = req.body;
    pool.query("INSERT INTO users (handle, displayname) VALUES ($1, $2) RETURNING *", [handle, displayName], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`User added with ID ${results.rows[0].id}`);
    });
};
// change the handle and display name of the user with the given id
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { handle, displayName } = req.body;
    pool.query("UPDATE users SET handle = $1, displayname = $2 WHERE id = $3", [handle, displayName, id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User modified with ID ${id}`);
    });
};
/* Queries regarding posting
 */
// get all posts, sorted by timestamp (most recent first)
const getPosts = (req, res) => {
    pool.query("SELECT posts.id AS postID, posts.content, posts.time, users.displayname, users.handle FROM posts JOIN users ON userid = users.id ORDER BY time DESC", (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// get posts by the given user, sorted by timestamp (most recent first)
const getPostsByUser = (req, res) => {
    const userID = parseInt(req.params.userID);
    pool.query("SELECT posts.id AS postID, posts.content, posts.time, users.displayname, users.handle FROM posts JOIN users ON userid = users.id WHERE userid = $1 ORDER BY time DESC", [userID], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// create a new post by the given user
// TODO: add login script so that the user can be verified
const createPost = (req, res) => {
    const { userID, content } = req.body;
    pool.query("INSERT INTO posts (userid, time, content) VALUES ($1, now(), $2) RETURNING *", [userID, content], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Post added with ID ${results.rows[0].id}`);
    });
};
// deletes the given post from the database
const deletePost = (req, res) => {
    const postID = req.body.postID;
    pool.query("DELETE FROM posts WHERE id = $1", [postID], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Post deleted with ID ${postID}`);
    });
};
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    getPosts,
    getPostsByUser,
    createPost,
    deletePost
};
