const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/class.controller");

// CREATE class
router.post("/", ClassController.createClass);

// READ all classes
router.get("/", ClassController.getClasses);

// READ class by id
router.get("/:id", ClassController.getClassById);

// UPDATE class
router.put("/:id", ClassController.updateClass);

// DELETE class
router.delete("/:id", ClassController.deleteClass);

router.put("/:classId/update-children", ClassController.updateChildrenInClass);

module.exports = router;
