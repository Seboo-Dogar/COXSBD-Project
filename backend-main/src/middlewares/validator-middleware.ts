import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

export function validationMiddleware<T extends object>(
  type: new () => T,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Convert plain req.body into an instance of the DTO class
    const dtoObj = plainToInstance(type, req.body);

    // Validate the dtoObj instance
    const errors = await validate(dtoObj);

    if (errors.length > 0) {
      // Extract all error messages from the constraints
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();

      return res.status(400).json({ errors: errorMessages });
    } else {
      next();
    }
  };
}
