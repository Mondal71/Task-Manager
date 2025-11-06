import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStatusToggle = async () => {
    try {
      const newStatus = task.status === "pending" ? "completed" : "pending";
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  if (!task) return <p className="text-center p-10">Loading...</p>;

  const priorityColor = {
    high: "bg-red-100 border-red-500",
    medium: "bg-yellow-100 border-yellow-500",
    low: "bg-green-100 border-green-500",
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div
        className={`p-4 border rounded ${priorityColor[task.priority]} mb-6`}
      >
        <h2 className="text-2xl font-bold">{task.title}</h2>

        <p className="mt-3 text-gray-700">
          {task.description || "No description"}
        </p>

        <p className="mt-3 text-sm">
          <span className="font-medium">Due:</span>{" "}
          {new Date(task.dueDate).toLocaleDateString()}
        </p>

        <span
          className={`inline-block mt-3 px-3 py-1 rounded text-white text-sm ${
            task.status === "completed" ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {task.status}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleStatusToggle}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          {task.status === "pending" ? "Mark Completed" : "Mark Pending"}
        </button>

        <Link
          to={`/edit/${task._id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
