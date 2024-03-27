// Importing necessary modules from the 'express' package to handle HTTP requests and responses.
import {Request, Response} from 'express';
// Importing the User model from the userModel.js file, which defines the schema for the user documents in the MongoDB database.
import Folder from '../model/folderModel.js';
import Note from '../model/noteModel.js';
import mongoose from 'mongoose';
import { getModelBy } from '../utilities/dbFunctions.js';

const objectId = mongoose.Types.ObjectId;

interface filterdNotes {
    content: string;
    fileName: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createFolder = async  (req: Request, res: Response) => {
    
    try {
            // Validates the incoming request to ensure it contains a body with JSON data.
        if (!req.body) {
            // Responds with a 400 Bad Request error if the request body is missing.
            return res.status(400).json({"Error": "Not a valid JSON"});
        } else if (!("folderName" in req.body)) {
            // Responds with a 400 Bad Request error if the 'folderNmae' field is missing in the request body.
            return res.status(400).json({"Error": "Missing folder name"});
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


export const getRootFolder = async (req: Request, res: Response) => {
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

export const getNotesForFolder = async (req: Request, res: Response) => {
    // Get all Notes for a folder
    const folderId = req.params.folderId; // retreive folderId from request
    let objFolderId: mongoose.Types.ObjectId;
    try {
        objFolderId = new objectId(folderId); // convert folderId to objectId
    } 
    catch (error) {
        return res.status(400).json({message: "Invalid folderId"});
    }
   
    //get all notes to a folder
    getModelBy(Note, 'folderId', objFolderId)
    .then((notes) => {
        if (notes.length === 0) {
            return res.status(400).json({message: "Folder is empty"});
        }
        
        const filteredNotes: filterdNotes[] = notes.map((note: any) => ({
            fileName: note.fileName,
            id: note._id,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }));
        (getModelBy(Folder, '_id', objFolderId))
        .then((folder: any) => {
            if (folder.length === 0) {
                return res.status(404).json({message: "Folder not found"});
            }

        // return all notes in that folder
            res.status(200).json({
                "folders": [
                    {
                        "folderId": folder[0]._id,
                        "folderName": folder[0].folderName,
                        "notes": filteredNotes
                    }
                ]
            });
        });
    })
    .catch(error => {
        if (error instanceof Error) {
            // error with the query
            res.status(500).json({
                message: error.message
            });
        }
    });     
};
