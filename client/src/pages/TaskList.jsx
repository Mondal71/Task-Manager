import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8; // tasks per page

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        params: {
          priority: priorityFilter,
          page,
          limit,
        },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [priorityFilter, page]);

  const priorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-100";
      case "medium":
        return "border-yellow-500 bg-yellow-100";
      default:
        return "border-green-500 bg-green-100";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        <Link
          to="/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <button
          className={`px-3 py-1 rounded ${
            priorityFilter === "" ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPriorityFilter("")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${
            priorityFilter === "low"
              ? "bg-green-600 text-white"
              : "bg-green-200"
          }`}
          onClick={() => setPriorityFilter("low")}
        >
          Low
        </button>
        <button
          className={`px-3 py-1 rounded ${
            priorityFilter === "medium"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-200"
          }`}
          onClick={() => setPriorityFilter("medium")}
        >
          Medium
        </button>
        <button
          className={`px-3 py-1 rounded ${
            priorityFilter === "high" ? "bg-red-600 text-white" : "bg-red-200"
          }`}
          onClick={() => setPriorityFilter("high")}
        >
          High
        </button>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Link
            key={task._id}
            to={`/task/${task._id}`}
            className={`p-4 border rounded shadow-sm hover:shadow-md transition ${priorityClass(
              task.priority
            )}`}
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-700 mt-1">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <span
              className={`text-xs px-2 py-1 rounded inline-block mt-2 ${
                task.status === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {task.status}
            </span>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
