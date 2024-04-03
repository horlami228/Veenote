import {Request, Response} from 'express';
import User from '../model/userModel.js';
import Folder from '../model/folderModel.js';
import { hashPassword } from '../utilities/passwordHashing.js';

// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createUser = async  (req: Request, res: Response) => {
    
    try {
            // Validates the incoming request to ensure it contains a body with JSON data.
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        } else if (!("userName" in req.body)) {
            // Responds with a 400 Bad Request error if the 'userName' field is missing in the request body.
            return res.status(400).json({"Error": "Missing Username"});
        } else if (!("email" in req.body)) {
            // Responds with a 400 Bad Request error if the 'email' field is missing in the request body.
            return res.status(400).json({"Error": "Missing Email"});
        } else if (!("password" in req.body)) {
            // Responds with a 400 Bad Request error if the 'password' field is missing in the request body.
            return res.status(400).json({"Error": "Missing Password"});
        }

        const password = req.body.password;

        // Hash the password
        req.body.password = await hashPassword(password);

        // Extracts the data from the request body.
        const data = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        };

        const userExists = await User.findOne({ $or: [{ email: data.email }, { userName: data.userName }] });
        if (userExists) {
            return res.status(400).json({ "Error": "User with the provided email or username already exists" });
        }

        // Initializes a new instance of the User model with the extracted data.
        const new_user = new User(data);

        // Saves the new user instance to the MongoDB database and awaits its completion.
        const user = await new_user.save();

        // Create the root folder for the user
        const folderData = {
            folderName: `${user.userName} Root Folder`,
            isRoot: true,
            userId: user.id
        };

        const new_folder = new Folder(folderData);
        const folder = await new_folder.save();

        // Responds with a 200 OK status and the newly created user data in JSON format.
        res.status(201).json({"User": user, "Folder": folder});

    } catch(error) {
        // Catches any errors that occur during the execution of the try block.
        if (error instanceof Error) {

            if ((error as any).code === 11000) {
                return res.status(409).json({
                  errorCode: 'UserExists',
                  errorMessage: "User with the provided email or username already exists",
                  errorDetails: "A user with the same email or username already exists in the database. Please use a unique email or username.",
                  error: error.message
              });
            }
            // Responds with a 500 Internal Server Error status and the error details if an exception occurs.
            res.status(500).json({
                "Error": "Error Creating A User",
                "Details": error.message
            });
        }
    }
 
};


export const allUsers = (req: Request, res: Response) => {
    // Use the 'find' method on the User model to query the database.
    // This returns a Promise.
    User.find({})
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    "Error": "No user was found"
                });
            }
            
            // If the query is successful, send a 200 OK response with the users data.
            res.status(200).json(users);
        })
        .catch(error => {
            // If there's an error during the query, respond with a 500 Internal Server Error.
            // The error message is included in the response.
            res.status(500).json({
                "Error": "Getting all Users",
                "Details": error.message
            });
        });
};


export const userByName = (req: Request, res: Response) => {
    // use the 'find' method on the User model to find a user by the userName
    // This returns a promise

    const userName: string | number = req.params.userName;

    User.find({"userName": userName})
    .then(user => {
        if (user.length === 0) {
            return res.status(404).json({
                "Error": "User not found"
            });
        }
        
        // if the query is succesfull, send a 200 OK response with the user data

        res.status(200).json(user);
    })
    .catch(error => {
        // if there is an error during query, respons with a 500 Internal Server Error

        res.status(500).json({
            "Error": "Getting User",
            "Details": error.message
        });
    });
};


export const deleteUser = (req: Request, res: Response) => {
    const id: string = req.params.userName;

    User.findOneAndDelete({"_id": id})
    .then(user => {

        // if succesful send a 200 OK with the deleted data
        res.status(200).json({"Deleted": user});
        
    })
    .catch(error => {
        // if error occured response with 500 Internal Server Error and print out error
        // error message is included in the response
        res.status(500).json({
            "Error": "Failed to perform delete",
            "Details": error.message
        });
    });
};

export const updateUser = (req: Request, res: Response) => {
    
    const userId = (req as Request & { user: any }).user._id;

    User.findOneAndUpdate({ _id: userId }, req.body, { new: true })
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.save();
        
        // if the user is successfully updated, send a 200 OK response
        res.status(200).json({
            message: "User updated successfully",
        });
    })
    .catch(error => {
        // if there is an error during query, respond with a 500 Internal Server Error
        res.status(500).json({
            message: "Error updating user",
            details: error.message,
        });
    });
};
