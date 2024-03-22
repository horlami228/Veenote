// This module is for authentication

import { Request, Response, NextFunction } from "express";
import User from "../../model/userModel.js";
import { comparePassword } from "../../utilities/passwordHashing.js";

// Define the 'login' controller function as an asynchronous function to handle POST requests for user login.
export const loginMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validates the incoming request to ensure it contains a body with JSON data.
        if (Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
        } else if (!("userNameOrEmail" in req.body)) {
        // Responds with a 400 Bad Request error if the 'email' field is missing in the request body.
        return res.status(400).json({ Error: "Missing Email or UserName" });
        } else if (!("password" in req.body)) {
        // Responds with a 400 Bad Request error if the 'password' field is missing in the request body.
        return res.status(400).json({ Error: "Missing Password" });
        }
    
        // Extracts the email/userName and password from the request body.
        const { userNameOrEmail, password } = req.body;
    
        // Find the user with the provided email in the MongoDB database.
        const user = await User.findOne({ $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }]});
    
        // Respond with a 404 Not Found error if the user is not found in the database.
        if (!user) {
        return res.status(404).json({ Error: "User not found" });
        }
    
        // Compare the provided password with the hashed password stored in the database.
        const isMatch = await comparePassword(password, user.password);
    
        // Respond with a 401 Unauthorized error if the passwords do not match.
        if (!isMatch) {
        return res.status(401).json({ Error: "Invalid Password" });
        }
    
        // Respond with a 200 OK status and the user data in JSON format if the login is successful.
        (req as Request & { user: any }).user = user;
        next(); // Call the next middleware function
    } catch (error) {
        // Catches any errors that occur during the execution of the try block.
        if (error instanceof Error) {
        // Responds with a 500 Internal Server Error status and the error details if an exception occurs.
        res.status(500).json({ message: error.message });
        }
    }
};


// Define the 'logout' controller function to handle POST requests for user logout.
export const logout = (req: Request, res: Response) => {
    // Respond with a 200 OK status and a success message when the user logs out.
    res.status(200).json({ message: "User logged out successfully" });
};


export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    if ((req as Request & { user: any }).user) {
        res.status(200).json({ message: "User is authenticated", user: (req as Request & { user: any }).user });
    }
    else {
        res.status(401).json({ message: "User is not authenticated" });
    }
   
};
