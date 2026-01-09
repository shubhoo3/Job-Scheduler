# Job Scheduler & Automation System
This system allows users to create background tasks, track their execution status, and trigger webhooks upon completion. This project was developed with the help of AI assistance (Claude).

## 🎯 Project Overview

This application implements a mini automation engine with the following capabilities:

- ✅ Create jobs with custom payloads  
- ✅ Track job status (pending → running → completed)  
- ✅ Filter jobs by status and priority  
- ✅ Execute jobs with simulated processing  
- ✅ Trigger outbound webhooks on completion  
- ✅ View detailed job information and webhook responses

## Project Structure
`
job-scheduler-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobForm.js          (Create job form)
│   │   │   └── JobsTable.js        (Jobs dashboard & table)
│   │   ├── services/
│   │   │   └── api.js              (API client)
│   │   ├── App.js                  (Main app component)
│   │   ├── App.css                 (Styles)
│   │   ├── index.js                (React entry point)
│   │   └── .env                    (Frontend config)
│   ├── package.json
│
├── backend/
│   ├── database/
│   │   ├── db.js                   (SQLite connection & setup)
│   │   └── jobs.db                 (SQLite database file)
│   ├── controllers/
│   │   └── jobController.js        (Job logic)
│   ├── services/
│   │   └── jobService.js           (Webhook integration)
│   ├── routes/
│   │   └── jobRoutes.js            (API routes)
│   ├── app.js                      (Express server)
│   ├── package.json
│   ├── .env                        (Backend config)
`

## Tech Stack

**Frontend**
React - UI library
Axios - HTTP client
Tailwind CSS - Styling
JavaScript (ES6+)

**Backend**
Node.js - Runtime
Express.js - Web framework
SQLite3 - Database
Axios - HTTP requests
Dotenv - Environment variables

**Database**
SQLite - Lightweight relational database

## Backend Setup
mkdir backend
cd backend

npm init -y

npm install express cors dotenv sqlite3 axios

npm install -D nodemon

## Frontend Setup
mkdir frontend
cd frontend
npm create vite@latest
npm install react-router-dom axios
npm install tailwindcss @tailwindcss/vite

## Webhook Setup
Step 1: Open Your Browser
Open a new browser tab and go to:
https://webhook.site
Step 2: You'll See This
When you open webhook.site, you'll see:
`
┌─────────────────────────────────────────────┐
│  Your unique URL                            │
├─────────────────────────────────────────────┤
│                                             │
│  https://webhook.site/                     │
│  abc123de-f456-gh78-ij90-klmnopqrstu       │
│                                             │
│  [Copy]  [✓ Copied]                        │
│                                             │
├─────────────────────────────────────────────┤
│  Requests                                   │
│  (No requests yet)                          │
│                                             │
└─────────────────────────────────────────────┘`
Step 3: Copy Your URL

Example Your URL looks like: https://webhook.site/abc123de-f456-gh78-ij90-klmnopqrstu
⚠️ Important: Each time you refresh webhook.site, you get a NEW URL!

## View Webhook Data Example
`
┌────────────────────────────────────────────────┐
│  Request Details                               │
├────────────────────────────────────────────────┤
│  Method: POST                                  │
│  URL: https://webhook.site/abc123              │
│  Time: 2024-01-15T10:30:03.000Z               │
│                                                │
│  HEADERS:                                      │
│  ─────────                                      │
│  Content-Type: application/json                │
│  User-Agent: axios/1.4.0                       │
│                                                │
│  BODY (JSON):                                  │
│  ───────────                                    │
│  {                                             │
│    "jobId": 1,                                 │
│    "taskName": "Send Email",                   │
│    "priority": "High",                         │
│    "payload": {                                │
│      "email": "user@example.com"               │
│    },                                          │
│    "completedAt": "2024-01-15T10:30:03.000Z"   │
│  }                                             │
│                                                │
└────────────────────────────────────────────────┘
`

