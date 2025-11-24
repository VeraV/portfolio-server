"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../db/index"));
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    index_1.default.techCategory
        .findMany()
        .then((techCategories) => {
        techCategories.forEach((techCategory) => {
            console.log(techCategory.name);
        });
    })
        .catch((err) => {
        console.log("Error getting Tech Categories from DB", err);
        res
            .status(500)
            .json({ message: "Error getting Tech Categories from DB" });
    });
});
exports.default = router;
