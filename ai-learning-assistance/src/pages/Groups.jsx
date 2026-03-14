import React, { useEffect, useState } from "react";
import { FaUsers, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/group/GroupCard";
import { useGroup } from "../context/GroupContext";

function Groups() {

  const {
    groups,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useGroup();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async () => {
    if (!name) return;

    await createGroup({ name, description });
    resetModal();
  };

  const handleUpdate = async () => {
    await updateGroup(editingGroup._id, { name, description });
    resetModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this group?")) return;
    await deleteGroup(id);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setName(group.name);
    setDescription(group.description || "");
    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setName("");
    setDescription("");
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="lg:text-3xl text-2xl font-bold flex items-center gap-2">
          <FaUsers /> Groups
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Create Group
        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard
            key={group._id}
            group={group}
            onView={() => navigate(`/group/${group._id}`)}
            onEdit={() => openEditModal(group)}
            onDelete={() => handleDelete(group._id)}
          />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative m-4">

            <button
              onClick={resetModal}
              className="absolute top-3 right-3 text-gray-500"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingGroup ? "Edit Group" : "Create Group"}
            </h2>

            <div className="space-y-4">

              <input
                className="border border-gray-300 w-full p-2 rounded-lg"
                placeholder="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="border border-gray-300 w-full p-2 rounded-lg"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={editingGroup ? handleUpdate : handleCreate}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {editingGroup ? "Update Group" : "Create Group"}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Groups;