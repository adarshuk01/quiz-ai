import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const GroupContext = createContext();

export const useGroup = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [groupName, setGroupName] = useState("");

  /* ---------------- GROUPS ---------------- */

  const fetchGroups = async () => {
    const res = await axiosInstance.get("/group/my");
    setGroups(res.data);
  };

  const createGroup = async (data) => {
    await axiosInstance.post("/group", data);
    fetchGroups();
  };

  const updateGroup = async (id, data) => {
    await axiosInstance.put(`/group/${id}`, data);
    fetchGroups();
  };

  const deleteGroup = async (id) => {
    await axiosInstance.delete(`/group/${id}`);
    fetchGroups();
  };

  /* ---------------- STUDENTS ---------------- */

  const fetchStudents = async (groupId) => {
    const res = await axiosInstance.get(`/group/${groupId}/students`);
    setStudents(res.data.students);
    setGroupName(res.data.groupName);
  };

  const addStudent = async (groupId, data) => {
    await axiosInstance.post(`/group/${groupId}/student`, data);
    fetchStudents(groupId);
  };

  const uploadStudents = async (groupId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post(`/group/${groupId}/upload`, formData);
    fetchStudents(groupId);
  };

  const removeStudent = async (groupId, studentId) => {
    await axiosInstance.delete(`/group/student/${studentId}`);
    fetchStudents(groupId);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        students,
        groupName,
        fetchGroups,
        createGroup,
        updateGroup,
        deleteGroup,
        fetchStudents,
        addStudent,
        uploadStudents,
        removeStudent,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};