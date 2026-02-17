/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";
import { envVars } from "../config/env";
import AppError from "../errorHelplers/AppError";
import { handleZodError } from "../errorHelplers/handleZodError";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error From Global Error Handler: ", err);
  }

  // Handle cloudinary single image file delete
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }

  // Handle cloudinary multiple image files delete
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errorSources: TErrorSources[] = [];
  let stack: string | undefined = undefined;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    // ...(envVars.NODE_ENV === "development" && { stack, error: err }),
  };

  res.status(statusCode).json(errorResponse);
};
