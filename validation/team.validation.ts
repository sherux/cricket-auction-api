import { ZodError, z } from "zod";



export const teamSchemaForCreate = z.object({
    team_name: z.string().nonempty("Team Name is required").min(4, { message: ' Team Name must have a minimum length of 4 characters' }),


});



export const teamSchemaForUpdate = z.object({
    team_name: z.string().nonempty("Team Name is required").min(4, { message: ' Team Name must have a minimum length of 4 characters' }),


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
