import z from "zod";

const createSpecialtyZodSchema = z.object({
  title: z.string("Title is required and must be string!"),
  description: z.string("Description must be string!").optional(),
});

export const SpecialtyValidation = {
  createSpecialtyZodSchema,
};
