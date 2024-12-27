import Config from "./config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import figlet from "figlet";
import chalk from "chalk";
import { MongoDB } from "./mongoDB-setup";
import { requestLogger } from "./Middlewares/logger";
import userRouter from "./Routers/Users";
import roleRouter from "./Routers/Roles";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);
app.use(helmet());
app.use(requestLogger);

async function startServer() {
  try {
    await MongoDB.connectDB();
    app.listen(Config.PORT, () => {
      console.log("..................................................");
      console.log(
        chalk.green(
          figlet.textSync("Change Networks", {
            font: "Bulbhead",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
          })
        )
      );
      console.log(
        `server running on port : ${Config.PORT} in ${Config.NODE_ENV} mode`
      );
      console.log("...................................................");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
startServer();

app.get(`${Config.API_PREFIX}health`, async (req: Request, res: Response) => {
  res.json({ message: "hai hello" });
});
app.use(`${Config.API_PREFIX}roles`, roleRouter);
app.use(`${Config.API_PREFIX}users`, userRouter);
