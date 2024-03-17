// Importing necessary modules from the 'express' package to handle HTTP requests and responses.
import {Request, Response} from 'express';
// Importing the User model from the userModel.js file, which defines the schema for the user documents in the MongoDB database.
import Folder from '../model/folderModel.js';
// Importing the base model from the baseModel.ts file, which defines generic functions


// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createFolder = async  (req: Request, res: Response) => {
    
    try {
            // Validates the incoming request to ensure it contains a body with JSON data.
        if (!req.body) {
            // Responds with a 400 Bad Request error if the request body is missing.
            return res.status(400).json({"Error": "Not a valid JSON"});
        } else if (!("folderName" in req.body)) {
            // Responds with a 400 Bad Request error if the 'folderNmae' field is missing in the request body.
            return res.status(400).json({"Error": "Missing FolderName"});
        }
        // Extracts the data from the request body.
        const folderData = {
            folderName: req.body.folderName,
            is_root: false,
            userId: ""
        };
        
        // Initializes a new instance of the User model with the extracted data.
        const new_folder = new Folder(folderData);

        // Saves the new user instance to the MongoDB database and awaits its completion.
        const folder = await new_folder.save();

        // Responds with a 200 OK status and the newly created user data in JSON format.
        res.status(201).json(folder);

    } catch(error) {
        // Catches any errors that occur during the execution of the try block.
        if (error instanceof Error) {
            // Responds with a 500 Internal Server Error status and the error details if an exception occurs.
            res.status(500).json({
                "Error": "Error Creating A Folder",
                "Details": error.message
            });
        }
    }
 
};


export const getRootFolder = (req: Request, res: Response) => {
    // use the 'find' method on the Folder model to find a root folder by the user_id
    // This returns a promise

    const user_id: string | number = req.params.userName;

    Folder.find({"userId": user_id, "isRoot": true})
    .then(folder => {
        if (folder.length === 0) {
            return res.status(404).json({
                "Error": "Folder Not Found"
            });
        }
        
        // if the query is succesfull, send a 200 OK response with the root folder

        res.status(200).json(folder);
    })
    .catch(error => {
        // if there is an error during query, respons with a 500 Internal Server Error

        res.status(500).json({
            "Error": "Getting Folder",
            "Details": error.message
        });
    });
};
