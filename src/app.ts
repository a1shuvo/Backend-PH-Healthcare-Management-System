import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import status from "http-status";
import path from "path";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

// ejs view setup
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

// Cors setup
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  // res.send("PH Healthcare api is up and running! 🚀");
  res.status(status.OK).json({
    success: true,
    message: "PH Healthcare api is up and running 🚀",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
