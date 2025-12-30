const express = require("express");
const router = express.Router();
const childController = require("../controllers/child.controller");

router.post("/", childController.createChild);
router.get("/", childController.getAllChildren);
router.get("/class/:classId", childController.getChildrenByClass);
router.get("/:id", childController.getChildById);
router.put("/:id", childController.updateChild);
router.delete("/:id", childController.deleteChild);

module.exports = router;
