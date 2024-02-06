import "dotenv/config";
import express from "express";
import expressauth from "express-openid-connect";
import {queryNormalized} from "./api/db/connection-pool.js";
import bodyParser from "body-parser";


const { auth, requiresAuth } = expressauth;

const app = express();
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        secret: process.env.AUTH0_SECRET,
        baseURL: process.env.BASE_URL,
        clientID: process.env.AUTH0_CLIENT_ID,
        issuerBaseURL: "https://" + process.env.AUTH0_DOMAIN,
    })
);



app.use(requiresAuth());

app.use(express.static("web/page"));
app.use(express.static("web"));


app.use(async (req, res, next) => {
    const users = await queryNormalized("SELECT * FROM users WHERE auth0_id=$1", [
        req.oidc.user.sub,
    ]);
    req.user = users[0];
    next();
});


app.use(bodyParser.json());
app.get("/api/home", async (req, res) => {
    const userId = req.user.id;
    const beeps = await queryNormalized(
        `SELECT users.name AS author_name,
        users.id AS author_id,
        users.picture AS author_picture,
        beep.id,
        beep.content,
        beep.like_count,
        created_at,
        liked.id IS NOT NULL AS liked
    FROM beep
    JOIN users ON users.id = beep.author_id
    LEFT JOIN liked ON liked.liker_id = $1 AND liked.beep_id = beep.id
    ORDER BY created_at DESC`, [userId]
);
    res.json(beeps);
});

app.post("/api/beep", async (req, res) => {
    const dbRes = await queryNormalized(
        `
   INSERT INTO beep(content, author_id) VALUES($1, $2) RETURNING *;
 `,
        [req.body.content, req.user.id]
    );
    let post = dbRes[0];
    post.authorName = req.user.name;
    post.authorPicture = req.user.picture;
    res.json(post);
});

app.post("/api/like", async (req, res) => {
    const dbRes = await queryNormalized(
        `
   INSERT INTO liked(liker_id, beep_id) VALUES($1, $2);
 `,
        [req.user.id, req.body.beepId]
    );
    const dbRes2 = await queryNormalized(
        ` 
        UPDATE beep SET like_count = like_count + 1 WHERE beep.id = $1 RETURNING *;
        `
        , [req.body.beepId]
    );
    const post = dbRes2[0];
    const newLikeCount = post.likeCount;
    res.json(newLikeCount);
});

app.delete("/api/delete", async (req, res) => {
    const dbRes = await queryNormalized(
        `
    DELETE FROM beep
    WHERE author_id = $1 AND id = $2;
  `,
        [req.user.id, req.body.beepId]
    );
    res.json({});
});
app.post("/api/unlike", async (req, res) => {
    const dbRes = await queryNormalized(
        `
    DELETE FROM liked
    WHERE liker_id = $1 AND beep_id = $2;
  `,
        [req.user.id, req.body.beepId]
    );
    const dbRes2 = await queryNormalized(
        `
        UPDATE beep SET like_count = like_count - 1 WHERE beep.id = $1 RETURNING *;
        `
        , [req.body.beepId]
    );
    const post = dbRes2[0];
    const newLikeCount = post.likeCount;
    res.json(newLikeCount);
});



app.listen(3000);