"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const userController_1 = __importDefault(require("../Controllers/userController"));
const blogController_1 = __importDefault(require("../Controllers/blogController"));
const router = express.Router();
router
    .route("/mockdata")
    .get(userController_1.default.getData)
    .post(userController_1.default.createData);
router
    .route("/mockdata/:id")
    .get(userController_1.default.getDataById)
    .delete(userController_1.default.deleteDataById)
    .put(userController_1.default.updateDataById);
router.get("/errorhandler", () => {
    throw new Error("Error found here");
});
router.get("/healthcheck", (req, res) => {
    res.status(200).json({ message: "Everything is working properly" });
});
router.post("/signup", userController_1.default.register);
router.post("/login", userController_1.default.login);
router.get("/blogs", blogController_1.default.getAllBlogs);
router.post("/createblog", blogController_1.default.addBlog);
router
    .route("/blogs/:id")
    .get(blogController_1.default.getBlogById)
    .delete(blogController_1.default.deleteBlogById)
    .put(blogController_1.default.updateBlog);
router.get("/blogsof/:id", blogController_1.default.getBlogsByUser);
// router.get("/dashboard", authenticate, isAdmin, userController.dashboard);
exports.default = router;