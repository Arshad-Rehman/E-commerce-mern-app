import express from "express";
import { isAdmin, requiresignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, updateCategoryController,categoryController,singleCategoryController,deletecategoryCotroller} from "../controllers/categoryController.js";
const router = express.Router();

router.post('/create-category',requiresignIn,isAdmin,createCategoryController);

router.put('/update-category/:id',requiresignIn,isAdmin,updateCategoryController);
router.get('/get-category',categoryController);
router.get('/single-category/:slug',singleCategoryController);
router.delete('/delete-category/:id',requiresignIn,isAdmin,deletecategoryCotroller)
export default router