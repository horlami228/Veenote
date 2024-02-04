import {Router} from 'express';
import {allusers} from "../controller/userController.js";
const router = Router();

router.get("/users", allusers);

export default router;
