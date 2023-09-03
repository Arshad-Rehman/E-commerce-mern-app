import  express  from "express";
import {registorController,
    loginController,
    testController, 
    forgetPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    ordersStatusController
} from '../controllers/authController.js';
import { isAdmin, requiresignIn } from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.post('/registor',registorController);

routes.post('/login',loginController);

routes.post('/forget-password',forgetPasswordController)

routes.get('/test',requiresignIn,isAdmin,testController)

routes.get('/user-auth',requiresignIn,(req,resp)=>{
    resp.status(200).send({ ok: true })
})
routes.get('/admin-auth',requiresignIn,isAdmin, (req,resp)=>{
    resp.status(200).send({ ok: true })
})
routes.put('/profile',requiresignIn,updateProfileController);

routes.get('/orders',requiresignIn,getOrdersController);

routes.get('/all-orders',requiresignIn,getAllOrdersController);

routes.put('/order-status/:orderId',requiresignIn,isAdmin,ordersStatusController);
export default routes