// routes/attendance.route.js
const router = require("express").Router();
const controller = require("../controllers/attendance.controller");

router.post("/scan", controller.scanFace);

router.post("/", controller.createAttendance); // 1 hoặc nhiều child
router.get("/", controller.getAllAttendance);
router.get("/by-class", controller.getAttendanceByClassAndDate);
router.get("/:id", controller.getAttendanceById);
router.put("/:id", controller.updateAttendance);
router.delete("/:id", controller.deleteAttendance);

module.exports = router;
