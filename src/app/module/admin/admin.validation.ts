import z from "zod";

export const updateAdminZodSchema = z.object({
  admin: z
    .object({
      name: z.string("Name must be a string").optional(),
      profilePhoto: z.url("Profile photo must be a valid url").optional(),
      contactNumber: z
        .string("Contact number must be a string")
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 14 characters")
        .optional(),
    })
    .optional(),
});
