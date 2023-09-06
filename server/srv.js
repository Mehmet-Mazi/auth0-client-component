import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '../');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth_config.json', (req, res) => {
    res.sendFile(path.join(__dirname, "server/auth_config.json"))
})

app.listen(8080, () => console.log("Application is running on port 8080"));