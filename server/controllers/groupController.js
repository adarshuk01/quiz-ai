const Group = require("../models/groupModel");
const Student = require("../models/studentModel");
const XLSX = require("xlsx");


exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await Group.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Add Student Manually
exports.addStudent = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { rollNo, name } = req.body;

    const group = await Group.findOne({
      _id: groupId,
      createdBy: req.user.id,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const student = await Student.create({
      rollNo,
      name,
      group: groupId,
      createdBy: req.user.id,
    });

    group.students.push(student._id);
    await group.save();

    res.json(student);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Upload Students via Excel
exports.uploadStudentsExcel = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    // Check group ownership
    const group = await Group.findOne({
      _id: groupId,
      createdBy: req.user.id,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Read Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet);

    const studentsToInsert = [];

    for (const row of rows) {
      if (!row.rollNo || !row.name) continue;

      studentsToInsert.push({
        rollNo: row.rollNo.toString(),
        name: row.name.trim(),
        group: groupId,
        createdBy: req.user.id,
      });
    }

    // Prevent duplicate roll numbers in same group
    const existingStudents = await Student.find({
      group: groupId,
      rollNo: { $in: studentsToInsert.map((s) => s.rollNo) },
    }).select("rollNo");

    const existingRollNos = new Set(
      existingStudents.map((s) => s.rollNo)
    );

    const filteredStudents = studentsToInsert.filter(
      (s) => !existingRollNos.has(s.rollNo)
    );

    const insertedStudents = await Student.insertMany(filteredStudents);

    res.json({
      message: "Students uploaded successfully",
      inserted: insertedStudents.length,
      skipped: studentsToInsert.length - insertedStudents.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getMyGroups = async (req, res) => {
  try {

    const groups = await Group.aggregate([
      {
        $match: {
          createdBy: req.user._id
        }
      },

      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "group",
          as: "students"
        }
      },

      {
        $addFields: {
          studentCount: { $size: "$students" }
        }
      },

      {
        $project: {
          students: 0
        }
      },

      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(groups);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupStudents = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findOne({
      _id: groupId,
      createdBy: req.user.id,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const students = await Student.find({ group: groupId }).sort({
      rollNo: 1,
    });

    res.json({
      groupName: group.name,
      groupId: group._id,
      students,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;

    const group = await Group.findOneAndUpdate(
      {
        _id: groupId,
        createdBy: req.user.id,
      },
      {
        name,
        description,
      },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findOneAndDelete({
      _id: groupId,
      createdBy: req.user.id,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    await Student.deleteMany({ group: groupId });

    res.json({ message: "Group deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOneAndDelete({
      _id: studentId,
      createdBy: req.user.id,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student removed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};