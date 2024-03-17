import { Router } from "express";
import { createFolder, getRootFolder } from '../controller/folderController.js';

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

router.get('/folder/rootfolder', getRootFolder);


export default router;
