import  express from "express";
import { isAdmin, requiresignIn } from "../middlewares/authMiddleware.js";
import formidable from 'express-formidable'
import { createProductController,
    getProductController,
    getSingleProductController,
    ProductPhotoController,
    deleteProductController,
    createUpdateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchPorductController,
    relatedPorductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentsController
} from "../controllers/productController.js";

const router = express.Router();

router.post('/create-product',requiresignIn,isAdmin,formidable(),createProductController)
router.put('/update-product/:pid',requiresignIn,isAdmin,formidable(),createUpdateProductController)

router.get('/get-product',getProductController)
router.get('/get-product/:slug',getSingleProductController)
router.get('/product-photo/:pid',ProductPhotoController);
router.delete('/delete-product/:pid',deleteProductController)

router.post('/product-filter',productFilterController)
router.get('/product-count',productCountController);

router.get('/product-list/:page',productListController);

router.get('/search/:keyword',searchPorductController);

router.get('/related-product/:pid/:cid',relatedPorductController);

router.get('/product-category/:slug',productCategoryController);

router.get('/braintree/token',braintreeTokenController)

router.post('/braintree/payment',requiresignIn,braintreePaymentsController)
export default router