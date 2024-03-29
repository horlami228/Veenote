import { Router } from "express";
import { createNote, deleteNote, updateNote, getNote, getAllNotes}
 from '../controller/noteController.js';
import { authMiddleware } from "../controller/auth/authController.js";

// Create a new router instance
const router = Router();

/**
 * Route for creating a new note.
 * POST /user/create/note/new
 * The actual logic for user creation is encapsulated in the createFolder function within the folderController.
 */
router.post('/user/create/note/new', authMiddleware, createNote);


/**
 * Route for delete a note
 * DELETE /user/delete/note/:noteId
 * The actual logic for user creation is encapsulated in the deleteNote function within the noteController.
 */

router.delete('/user/note/delete/:noteId', authMiddleware, deleteNote);

/**
 * Route for updating a note
 * PUT /user/update/note/:noteId
 * The actual logic for user creation is encapsulated in the updateNote function within the noteController.
 */

router.put('/user/note/update/:noteId', authMiddleware, updateNote);

/**
 * Route for getting a note
 * GET /user/get/note/:noteId
 * The actual logic for user creation is encapsulated in the getNote function within the noteController.
 */

router.get('/user/note/:noteId', authMiddleware, getNote);

/**
 * Route for getting all notes
 * GET /user/get/notes
 * The actual logic for user creation is encapsulated in the getAllNotes function within the noteController.
 */
router.get('/user/notes/get', authMiddleware, getAllNotes);

export default router;
