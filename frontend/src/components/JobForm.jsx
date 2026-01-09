import React, { useState } from 'react';
import { createJob } from '../services/api';

export default function JobForm({ onJobCreated }) {
  const [taskName, setTaskName] = useState('');
  const [payload, setPayload] = useState('{}');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      JSON.parse(payload);

      await createJob({
        taskName,
        payload: JSON.parse(payload),
        priority
      });

      setSuccess('Job created successfully!');
      setTaskName('');
      setPayload('{}');
      setPriority('Medium');
      onJobCreated();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Invalid JSON or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border p-7">

      <h2 className="text-xl font-bold mb-4">➕ Create Job</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="text-sm font-medium">Task Name</label>
          <input
            className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
            placeholder="Send daily report"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Priority</label>
          <select
            className="w-full mt-1 border rounded-lg p-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Payload (JSON)</label>
          <textarea
            rows="6"
            className="w-full mt-1 border rounded-lg p-3 font-mono text-sm"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
