// Importing necessary modules from the 'express' package to handle HTTP requests and responses.
import {Request, Response} from 'express';
// Importing the User model from the userModel.js file, which defines the schema for the user documents in the MongoDB database.
import Note from '../model/noteModel.js';
import Folder from '../model/folderModel.js';
// Importing the base model from the baseModel.ts file, which defines generic functions


// Function to generate a formatted date and time string
function getFormattedDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }

// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createNote = async (req: Request, res: Response) => {
    try {
      // Validate request body
      if (!req.body) {
        return res.status(400).json({ message: "Not a valid JSON" });
      }
  
      // Ensure required fields are present
      if (!req.body.id || !req.body.content) {
        return res.status(400).json({ message: "ID and content are required fields" });
      }
  
      // Set default filename if missing
      req.body.fileName = req.body.fileName || `default-${getFormattedDateTime()}`;
  
      // Find the associated folder
      const folder = await Folder.findOne({ userId: req.body.id });
  
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
  
      // Create the note data object
      const noteData = {
        fileName: req.body.fileName,
        content: req.body.content,
        userId: req.body.id,
        folderId: folder._id
      };
  
      // Save the note
      const savedNote = await new Note(noteData).save();
  
      // Send a success response
      res.status(201).json({ message: "Note created successfully", data: savedNote });
    } catch (error) {
      // Handle all errors gracefully
      if (error instanceof Error) {
        res.status(500).json({ "message": "Error creating note", 
        "Error": error.message });
      }
    }
  };
  

export const getAllNotes = (req: Request, res: Response) => {
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
