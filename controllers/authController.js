import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModals from "../models/userModals.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
export const registorController = async (req, resp) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return resp.send({ error: "name is required" });
    }
    if (!email) {
      return resp.send({ message: "email is required" });
    }
    if (!password) {
      return resp.send({ message: "password is required" });
    }
    if (!phone) {
      return resp.send({ message: "phone is required" });
    }
    if (!address) {
      return resp.send({ message: "address is required" });
    }
    if (!answer) {
      return resp.send({ message: "answer is required" });
    }

    const existinguser = await userModals.findOne({ email });
    if (existinguser) {
      return resp.status(200).send({
        success: false,
        message: "alredy user are registered ",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new userModals({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    resp.status(201).send({
      success: true,
      message: "User registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

//login

export const loginController = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModals.findOne({ email });
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return resp.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_WEBTOKEN, {
      expiresIn: "7d",
    });
    resp.status(200).send({
      success: true,
      message: "successfully login",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "login error",
      error,
    });
  }
};

//test

export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const forgetPasswordController = async (req, resp) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email) {
      resp.status(400).send({ message: "Email is required" });
    }
    if (!newPassword) {
      resp.status(400).send({ message: "newPassword is required" });
    }
    if (!answer) {
      resp.status(400).send({ message: "answer is required" });
    }
    //check
    const user = await userModals.findOne({ email, answer });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "wrong Email and Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModals.findByIdAndUpdate(user._id, { password: hashed });
    resp.status(200).send({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "somthing wents wrong",
      error,
    });
  }
};

export const updateProfileController = async (req, resp) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModals.findById(req.user._id);
    if (password && password.length < 6) {
      return resp.json({ error: "Passowrd is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModals.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    resp.status(200).send({
      success: true,
      message: "profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "prodile not found",
      error,
    });
  }
};

export const getOrdersController = async (req, resp) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    resp.json(orders);
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      successs: false,
      message: "something went wrong",
      error,
    });
  }
};


export const getAllOrdersController =async(req,resp)=>{
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt: "-1"})
    resp.json(orders);
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      successs: false,
      message: "something went wrong",
      error,
    });
  }
}

export const ordersStatusController = async(req,resp)=>{
  try{
    const {orderId} = req.params;
    const { status} = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
    resp.json(orders)
  }catch(error){
console.log(error);
resp.status(400).send({
  success:false,
  message:"orders not found",
  error
})
  }
}