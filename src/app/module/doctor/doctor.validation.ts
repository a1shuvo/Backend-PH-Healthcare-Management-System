import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updateDoctorZodSchema = z.object({
  doctor: z
    .object({
      name: z
        .string("Name must be string")
        .min(5, "Name must be at least 5 characters")
        .max(30, "Name must be at most 30 characters")
        .optional(),
      profilePhoto: z.url("Profile photo must be a valid url").optional(),
      contactNumber: z
        .string("Contact number must be string")
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 14 characters")
        .optional(),
      address: z
        .string("Address must be a string")
        .min(10, "Address must be at least 10 characters")
        .max(100, "Address must be at most 100 characters")
        .optional(),
      registrationNumber: z
        .string("Registration number is required")
        .optional(),
      experience: z
        .int("Experience must be an integer")
        .nonnegative("Experience can not be negetive")
        .optional(),
      gender: z
        .enum(
          [Gender.MALE, Gender.FEMALE, Gender.OTHER],
          "Gender must be in male, female or other",
        )
        .optional(),
      appointmentFee: z
        .number("Appointment fee must be a number")
        .nonnegative("Appointment fee can not be negetive")
        .optional(),
      qualification: z
        .string("Qualification is required")
        .min(2, "Qualification must be at least 2 characters")
        .max(100, "Qualification must be at most 100 characters")
        .optional(),
      currentWorkingPlace: z
        .string("Current working place is required")
        .min(2, "Current working place must be at least 2 characters")
        .max(100, "Current working place must be at most 100 characters")
        .optional(),
      designation: z
        .string("Designation is required")
        .min(2, "Designation must be at least 2 characters")
        .max(50, "Designation must be at most 50 characters")
        .optional(),
    })
    .optional(),
  specialties: z
    .array(
      z.object({
        specialtyId: z.uuid("SpecialtyId must be a valid UUID"),
        shouldDelete: z.boolean("Should delete must be a boolean").optional(),
      }),
    )
    .optional(),
});
