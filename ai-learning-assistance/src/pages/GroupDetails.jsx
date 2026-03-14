import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { FaUpload, FaUserPlus, FaArrowLeft, FaTimes } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import { FaTrash } from "react-icons/fa6";
import { useGroup } from "../context/GroupContext";

function GroupDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState(""); 
  const [studentName, setStudentName] = useState(""); 
  const [file, setFile] = useState(null);
const {
  students,
  groupName,
  fetchStudents,
  addStudent,
  uploadStudents,
  removeStudent,
} = useGroup();

  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("manual");

useEffect(() => {
  fetchStudents(id);
}, [id]);


const handleAddStudent = async () => {
  if (!rollNo || !studentName) return;

  await addStudent(id, {
    rollNo,
    name: studentName,
  });

  setRollNo("");
  setStudentName("");

  setShowModal(false);
};

 const handleUpload = async () => {
  await uploadStudents(id, file);
  setFile(null);
  setShowModal(false);
    setShowModal(false);

};

const handleRemoveStudent = async (studentId) => {
  if (!window.confirm("Remove this student?")) return;
  await removeStudent(id, studentId);
};

  return (
    <div className="">

      {/* HEADER */}

      <div className="flex   justify-between items-center  mb-6">
        <div>
        <button
          onClick={() => navigate("/groups")}
          className="flex items-center gap-2 text-blue-600"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-2xl font-semibold">{groupName}</h2>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex text-nowrap items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaUserPlus /> Add Students
        </button>

      </div>

      {/* STUDENT TABLE */}

      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">

        <h3 className="text-lg font-semibold mb-4">Students</h3>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Roll No</th>
              <th className="py-2">Name</th>
            </tr>
          </thead>


<tbody>
  {students?.map((student) => (
    <tr key={student._id} className="border-b border-gray-300">
      <td className="py-2">{student.rollNo}</td>
      <td className="py-2">{student.name}</td>

      <td className="py-2 text-center">
        <button
  onClick={() => handleRemoveStudent(student._id)}
  className="text-red-500 hover:text-red-700"
>
  <FaTrash />
</button>
      </td>
    </tr>
  ))}
</tbody>

        </table>

      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl m-4 shadow-xl w-full max-w-md p-6 relative">

            {/* CLOSE */}

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Add Students
            </h2>

            {/* TABS */}

            <div className="flex border-b border-gray-300 mb-4">

              <button
                onClick={() => setTab("manual")}
                className={`flex-1 pb-2 font-medium ${tab === "manual"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                  }`}
              >
                Manual
              </button>

              <button
                onClick={() => setTab("excel")}
                className={`flex-1 pb-2 font-medium ${tab === "excel"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                  }`}
              >
                Excel Upload
              </button>

            </div>

            {/* MANUAL TAB */}

            {tab === "manual" && (

              <div className="space-y-3">

                <input
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  placeholder="Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />

                <input
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  placeholder="Student Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />

                <button
                  onClick={handleAddStudent}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add Student
                </button>

              </div>
            )}

            {/* EXCEL TAB */}

            {tab === "excel" && (

              <div className="space-y-3">

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="border p-2 rounded-lg w-full"
                />

                <button
                  onClick={handleUpload}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <FaUpload /> Upload Students
                </button>

                <p className="text-sm text-gray-500">
                  Excel format: rollNo | name
                </p>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default GroupDetails;