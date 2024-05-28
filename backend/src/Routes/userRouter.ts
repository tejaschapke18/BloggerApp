import express = require("express");
import { Request, Response } from "express";
import userController from "../Controllers/userController";
import authenticate from "../Middleware/authMiddleware";
import blogController from "../Controllers/blogController";

const router = express.Router();
router
  .route("/mockdata")
  .get(userController.getData)
  .post(userController.createData);

router
  .route("/mockdata/:id")
  .get(userController.getDataById)
  .delete(userController.deleteDataById)
  .put(userController.updateDataById);

router.get("/errorhandler", () => {
  throw new Error("Error found here");
});
router.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).json({ message: "Everything is working properly" });
});

router.post("/signup", userController.register);
router.post("/login", userController.login);
router.get("/blogs", authenticate, blogController.getAllBlogs);
router.post("/createblog", authenticate, blogController.addBlog);
router
  .route("/blogs/:id")
  .get(authenticate, blogController.getBlogById)
  .delete(authenticate, blogController.deleteBlogById)
  .put(authenticate, blogController.updateBlog);

router.get("/blogsof/:id", authenticate, blogController.getBlogsByUser);
router.put("/blogs/:id/like", blogController.likeBlog);
export default router;
