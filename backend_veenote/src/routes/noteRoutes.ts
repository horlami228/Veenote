import { Router } from "express";
import { createNote} from '../controller/noteController.js';
import { authMiddleware } from "../controller/auth/authController.js";

// Create a new router instance
const router = Router();

/**
 * Route for creating a new note.
 * POST /user/create/note/new
 * The actual logic for user creation is encapsulated in the createFolder function within the folderController.
 */
router.post('/user/create/note/new', authMiddleware, createNote);

export default router;
