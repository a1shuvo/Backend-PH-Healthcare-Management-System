import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import status from "http-status";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

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
