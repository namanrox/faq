import express from "express";
import { deleteFAQ, getFAQ, postFAQ } from "../controllers/faqController.js";

const router = express.Router();

router.route("/getfaq").get(getFAQ);
router.route("/postfaq").post(postFAQ);
router.route("/deletefaq/:id").delete(deleteFAQ);

export default router;
