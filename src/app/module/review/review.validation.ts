import z from "zod";

const createReviewZodSchema = z.object({
    appointmentId: z.string("Appointment ID must be a string"),
    rating: z.number("Rating must be a number").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string("Comment must be a string").min(1, "Comment cannot be empty")
})

const updateReviewZodSchema = z.object({
    rating: z.number("Rating must be a number").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
    comment: z.string("Comment must be a string").min(1, "Comment cannot be empty").optional()
})

export const ReviewValidation = {
    createReviewZodSchema,
    updateReviewZodSchema
}