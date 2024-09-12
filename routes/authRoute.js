import express from "express";
import {registerController, loginController, testController, forgotPasswordController, updateProfileController,getOrdersController,
  getAllOrdersController,
  orderStatusController,} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

//test routes
router.get("/test", requireSignIn, testController);

//Forgot Password
router.post("/forgot-password", forgotPasswordController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

  //protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);


export default router;