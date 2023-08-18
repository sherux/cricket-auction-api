import { ZodError, z } from "zod";



export const playerSchemaForCreate = z.object({
    name: z.string().nonempty("Name is required").min(4, { message: 'Name must have a minimum length of 4 characters' }),
    email: z.string().email('Invalid email address'),
    age: z.number().int().min(18, 'Minimum age is 15').max(45, 'Maximum age is 45'),
    jersey_no: z.number().int().min(1, 'Jersey number must be between 1 and 999').max(999, 'Jersey number must be between 1 and 999'),
    gender: z.enum(['male', 'female']).refine(val => val === 'male' || val === 'female',
        { message: 'Gender must be either "male" or "female"' }),

});



export const playerSchemaForUpdate = z.object({
    jersey_no: z.number().int().min(1, 'Jersey number must be between 1 and 999').max(999, 'Jersey number must be between 1 and 999'),


});


import { Response } from 'express';

export function handleZodValidationError(zodError: ZodError<any>, res: Response) {
    const errors: Record<string, string> = {};

    for (const error of zodError.errors) {
        const { path, message } = error;
        const key = path.join('.');
        errors[key] = message;
    }

    return res.status(422).json({
        status: 422,
        message: 'Please validate your inserted data',
        fields: errors,
    });
}
