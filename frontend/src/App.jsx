import React, { useState } from 'react';
import JobForm from './components/JobForm';
import JobsTable from './components/JobsTable';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(0);

  const handleJobCreated = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">
            🚀 Job Scheduler & Automation System
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto p-4 lg:p-8 w-full mt-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">

          {/* Form */}
          <div className="xl:col-span-1 sticky top-6 h-fit">
            <JobForm onJobCreated={handleJobCreated} />
          </div>

          {/* Dashboard */}
          <div className="xl:col-span-3">
            <JobsTable refresh={refresh} />
          </div>

        </div>
      </main>

    </div>
  );
}

export default App;
