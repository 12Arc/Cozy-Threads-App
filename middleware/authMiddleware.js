import JWT from "jsonwebtoken";
import userModel from "../model/userModel.js";


//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);

    // Find the user by the decoded _id and attach to req.user
    req.user = await userModel.findById(decode._id).select("_id name email role");

    // If no user is found, return an error
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};