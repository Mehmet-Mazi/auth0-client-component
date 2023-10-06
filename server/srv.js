import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressOauth2JwtBearer from "express-oauth2-jwt-bearer";
import authConfig from './auth_config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '../');

const app = express();

// MiddleWares
const checkJwt = expressOauth2JwtBearer.auth({
    audience: authConfig.audience,
    issuerBaseURL: `https://${authConfig.domain}`
}) // Sets the JWT-bearer middleware with your own Auth0 Application
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/test', checkJwt, (req, res) => {
    res.json({
        msg: "Your access token was successfully validated!"
    })
});



app.get('/auth_config', (req, res) => {
    res.json(authConfig);
})

app.use(function(err, req, res, next){
    // console.log(err, next, req);
    if (err.name === "UnauthorizedError"){
        return res.status(401).send({msg: "Invalid token pussy!"});
    }
    next(err, req, res);
})

app.listen(8080, () => console.log("Application is running on port 8080"));