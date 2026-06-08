import express from "express";
import {createProduct, getProducts, getProductById, updateProduct, deleteProduct} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.post( "/", authMiddleware, adminMiddleware, createProduct);

router.put( "/:id", authMiddleware, adminMiddleware, updateProduct);

router.delete( "/:id", authMiddleware, adminMiddleware, deleteProduct);


export default router;