import JWT from 'jsonwebtoken';
import userModals from '../models/userModals.js';
export const requiresignIn = async (req,resp,next) =>{
    try{
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_WEBTOKEN
        );
        req.user = decode;
        next();

    }catch(error){
        console.log(error);
    }
}


export const isAdmin = async (req, res, next) => {
    try {
      const user = await userModals.findById(req.user._id);
      if (user.role !== 1) {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access",
          
        });
    
      } else {
        next();
      }
      console.log(user);
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
      });
    }
  };
