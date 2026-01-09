import React, { useEffect, useState } from 'react';
import { getJobs, runJob } from '../services/api';

export default function JobsTable({ refresh }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [selected, setSelected] = useState(null);
  const [runningId, setRunningId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [refresh, status, priority]);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await getJobs({ status, priority });
    setJobs(res.data);
    setLoading(false);
  };

  const handleRun = async (id) => {
    setRunningId(id);
    await runJob(id);
    setTimeout(fetchJobs, 3500);
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">

      {/* Filters */}
      <div className="p-6 bg-gray-50 border-b grid md:grid-cols-2 gap-4">
        <select
          onChange={e => setStatus(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
        </select>

        <select
          onChange={e => setPriority(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-10 text-center">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No jobs found</p>
        </div>
      ) : (
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Task</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{job.taskName}</td>
                  <td className="p-4">{job.priority}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[job.status]}`}>
                      ● {job.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {job.status === 'pending' && (
                      <button
                        onClick={() => handleRun(job.id)}
                        disabled={runningId === job.id}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        {runningId === job.id ? "Running..." : "Run"}
                      </button>
                    )}

                    <button
                      onClick={() => setSelected(job)}
                      className="ml-2 bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-xl w-full max-w-xl"
          >
            <h3 className="font-bold text-lg mb-3">
              {selected.taskName}
            </h3>

            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(selected.payload, null, 2)}
            </pre>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
