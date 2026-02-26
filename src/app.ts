/* eslint-disable @typescript-eslint/no-explicit-any */
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import status from "http-status";
import cron from "node-cron";
import path from "path";
import qs from "qs";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AppointmentService } from "./app/module/appointment/appointment.service";
import { PaymentController } from "./app/module/payment/payment.controller";
import { IndexRoutes } from "./app/routes";

const app: Application = express();
app.set("query parser", (str: string) => qs.parse(str));

// ejs view setup
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

// stripe webhook
// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req: Request, res: Response) => {
//     console.log("Webhook received:", req.body);
//     res.status(200).json({ received: true });
//   },
// );
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

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

// Cron jobs
cron.schedule("*/25 * * * *", async () => {
  try {
    console.log("Running cron job to cancel unapid appointments...");
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error: any) {
    console.error(
      "Error occured while cancelling unpaid appointments: ",
      error.message,
    );
  }
});

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
