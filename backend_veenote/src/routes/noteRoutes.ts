import { Router } from "express";
import { createNote} from '../controller/noteController.js';


// Create a new router instance
const router = Router();

/**
 * Route for creating a new note.
 * POST /user/create/note/new
 * The actual logic for user creation is encapsulated in the createFolder function within the folderController.
 */
router.post('/user/create/note/new', createNote);

export default router;
