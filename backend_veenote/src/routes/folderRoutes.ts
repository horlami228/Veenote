import { Router } from "express";
import { createFolder, getRootFolder, getNotesForFolder } from '../controller/folderController.js';
import { authMiddleware } from "../controller/auth/authController.js";

// Create a new router instance
const router = Router();

/**
 * Route for creating a new folder.
 * POST /folder/create
 * The actual logic for user creation is encapsulated in the createFolder function within the folderController.
 */
router.post('/user/create', createFolder);


/**
 * Route for getting the root folder
 * GET /folder/getRoot
 */

router.get('/user/folder/rootfolder', getRootFolder);

/**
 * Route for getting notes in a folder
* GET /user/folder/<folderId>/notes
 */
router.get('/user/folder/:folderId/notes', authMiddleware, getNotesForFolder);

export default router;
