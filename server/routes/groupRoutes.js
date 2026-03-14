const express = require("express");
const router = express.Router();

const groupController = require("../controllers/groupController");
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");


router.post("/",protect, groupController.createGroup);

router.post(
  "/:groupId/student",
  protect,
  groupController.addStudent
);

router.post(
  "/:groupId/upload",protect,
  upload.single("file"),
  groupController.uploadStudentsExcel
);

router.get(
  "/my",
  protect,
  groupController.getMyGroups
);

router.get("/:groupId/students", protect, groupController.getGroupStudents);

router.put("/:groupId", protect, groupController.updateGroup);

router.delete("/:groupId", protect, groupController.deleteGroup);

router.delete("/student/:studentId", protect, groupController.removeStudent);

module.exports = router;