# Hospital Appointment Scheduler

This project is a simple full-stack web application that helps schedule doctor appointments in a fair and efficient way.
It allows users to add doctors, view their availability, and book appointments based on specialization.
The system automatically assigns the doctor who has the least number of current appointments so that workload is distributed evenly.

The application is built using React for the frontend and Node.js with Express and MongoDB for the backend.

---

## Features

* Add new doctors with specialization and daily patient capacity
* View all registered doctors and their current appointment load
* Book appointments by selecting specialization
* Automatic fair allocation of doctors based on availability
* Rejection message when all doctors are fully booked
* Simple and clean user interface with real-time updates

---

## How the Allocation Works

When a user books an appointment:

1. The system finds doctors matching the required specialization
2. It checks which doctors still have available capacity
3. Doctors are sorted by current number of appointments
4. The doctor with the least number of appointments is assigned
5. If all doctors reach their maximum limit, booking is rejected

This approach ensures that patients are distributed fairly among doctors.

---

## Project Structure

hospital-scheduler
│
├── backend
│   ├── models
│   ├── routes
│   ├── server.js
│
├── frontend
│   ├── components
│   ├── api
│   ├── App.jsx
│
└── README.md

---

## API Endpoints

POST `/api/add-doctor`
Adds a new doctor to the system

GET `/api/doctors`
Fetches all doctors

POST `/api/book-appointment`
Books an appointment based on specialization

---

## Running the Project Locally

### Backend

Go to backend folder and install dependencies:
npm install
npm run dev

Make sure MongoDB connection string is added in the .env file.

### Frontend

Go to frontend folder and run:
npm install
npm run dev

---

## Deployment

Frontend is deployed using Vercel.
Backend API is deployed using Render.
Database used is MongoDB Atlas cloud database.

---

## Technologies Used

Frontend: React
Backend: Node.js and Express
Database: MongoDB Atlas
HTTP Requests: Axios
Deployment: Vercel and Render

---

## Purpose of the Project

This project was created as part of a technical assignment to demonstrate:

* Full stack development skills
* REST API creation
* Database integration
* Fair scheduling logic
* Cloud deployment

The main focus was to build a working and deployable system with proper logic and clean UI.
