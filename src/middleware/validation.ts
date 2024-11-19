import { body, validationResult } from "express-validator";
import {Request, Response, NextFunction, RequestHandler} from "express"


//add middleware to apply this validation logic to the request

const handleValidationErrors = (req:Request, res:Response, next: NextFunction)=>{
 const errors = validationResult(req);
 if(!errors.isEmpty()){
      res.status(400).json({errors: errors.array()})
      return;
 }
 //if no errors then go to next to add logic to update user profile
 next();
}

export const validateMyUserRequest: RequestHandler[] = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors,
]