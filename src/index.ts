import { Express } from "express";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

import routes from "./routes/index";

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/", routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
