# CarePlus Multispeciality Hospital Management System

A full-stack, modern **Hospital Appointment Booking and Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) as a college academic project.

---

> ⚠️ **ACADEMIC PROJECT DISCLAIMER REGARDING PASSWORDS**
> Plain-text passwords are stored in MongoDB **ONLY** for this college/academic project demonstration to simplify student viva explanations and database inspection via MongoDB Compass. Plain-text password storage **MUST NOT** be used in a real production hospital environment. Production implementations must use salted hashing (e.g. bcrypt/argon2) and HTTPS TLS encryption.

---

## 📍 Hospital Location & Address
* **Hospital Name**: CarePlus Multispeciality Hospital
* **Location**: London, United Kingdom
* **Full Address**: 75 Harley Street, Marylebone, London, W1G 8QW, United Kingdom
* **General Line**: +44 20 7946 0900
* **Emergency Line (24/7)**: +44 20 7946 0999
* **Email**: info@careplushospital.co.uk

---

## 🌟 Key Features

### 🏥 Public Hospital Website
* **Modern Healthcare UI**: Premium healthcare design with sticky navbar, healthcare background images, dark glassmorphism overlays, and smooth animations.
* **Hospital Overview**: About section, mission, 20+ years medical experience highlights, and key statistics counter.
* **Clinical Specialities**: Explore 8 clinical departments (Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, Gynecology, Dentistry).
* **Doctor Search & Filtering**: Filter specialist doctors by department, specialization, name search, and experience level.
* **Doctor Details**: Comprehensive doctor profile showing qualifications, experience, consultation fee, working days, and time slot schedules.
* **Healthcare Services**: Emergency Care, Diagnostic Imaging, Pathology Lab, Pharmacy, ICU, and Health Checkup packages.
* **Interactive Contact Page**: Contact info, emergency helpline, working hours, and message inquiry form.

### 👤 Patient Portal
* **Registration & Login**: Fast registration and secure JWT authentication.
* **Patient Dashboard**: Stat cards (Total, Upcoming, Completed, Cancelled) and prominent **Next Upcoming Appointment** card.
* **Appointment Booking**: Dynamic 5-step booking process with real-time available time slot generation.
* **Server-Side Double-Booking Prevention**: Checks MongoDB before booking to guarantee two patients cannot book the same doctor, date, and time slot.
* **Upcoming Appointments**: Manage upcoming bookings with instant cancellation functionality (which immediately releases the time slot for other patients).
* **Appointment History**: Filterable history table (All, Pending, Confirmed, Completed, Cancelled).
* **Patient Profile**: Edit personal contact details, gender, DOB, and address.

### 🛡️ Admin Portal
* **Dashboard Analytics**: Executive statistics on Total Patients, Active Doctors, Today's Appointments, and status breakdowns.
* **Appointment Management**: Filter by status, doctor, patient, date, or department; update appointment status (`Pending` ➔ `Confirmed` ➔ `Completed` / `Cancelled`).
* **Doctor Management**: Add new doctors, edit qualifications/fees/schedules, and **deactivate doctors** (preserving past appointment history for database integrity).
* **Patient Management**: Search patient database, view appointment counts, and open full patient consultation history.
* **Department Management**: Add, edit, or deactivate clinical departments.
* **System Settings**: View central hospital metadata and MongoDB connection info.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, React Router DOM v6, Axios, Context API, CSS3 (Vanilla Design System), Lucide React Icons, Vite.
* **Backend**: Node.js, Express.js, Mongoose ODM, JSON Web Token (JWT), CORS, dotenv.
* **Database**: Local **MongoDB Community Server** (`mongodb://127.0.0.1:27017/hospital_management`).
* **DB Management Tool**: MongoDB Compass.

---

## 🗄️ MongoDB & MongoDB Compass Setup

1. **Install & Start MongoDB Community Server** on your local machine.
2. Open **MongoDB Compass**.
3. Connect to URI: `mongodb://127.0.0.1:27017`
4. The database name is **`hospital_management`**.
5. Once seeded/started, MongoDB Compass will display 4 collections:
   * `users`
   * `doctors`
   * `departments`
   * `appointments`

---

## 🔑 Development Seed Accounts

Run the database seed script to populate initial sample data:

```bash
cd server
npm run seed
```

### Credentials:
* 👨‍⚕️ **Administrator**:
  * **Email**: `admin@hospital.com`
  * **Password**: `Admin@123`
  * **Role**: `admin`
* 👤 **Sample Patient**:
  * **Email**: `patient@gmail.com`
  * **Password**: `Patient@123`
  * **Role**: `patient`

---

## 🚀 Quick Startup Guide

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed      # Populates local MongoDB
npm run dev       # Starts Express backend on http://localhost:5000
```

### 2. Frontend Client Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev       # Starts React client on http://localhost:5173
```

### 3. Production Build
```bash
cd client
npm run build     # Generates production bundle in client/dist
```

---

## ⚡ API Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new patient account | Public |
| **POST** | `/api/auth/login` | Login user & return JWT token | Public |
| **GET** | `/api/auth/me` | Fetch authenticated profile | Private |
| **GET** | `/api/doctors` | List active doctors (filter by dept/search) | Public |
| **GET** | `/api/doctors/:id` | Fetch single doctor details | Public |
| **POST** | `/api/doctors` | Add new doctor | Admin |
| **PUT** | `/api/doctors/:id` | Update doctor info/schedule | Admin |
| **DELETE** | `/api/doctors/:id` | Deactivate doctor | Admin |
| **GET** | `/api/departments` | List clinical departments | Public |
| **POST** | `/api/departments` | Add new department | Admin |
| **GET** | `/api/appointments/available-slots` | Calculate dynamic time slots | Public |
| **POST** | `/api/appointments` | Book appointment (double-booking check) | Patient / Admin |
| **GET** | `/api/appointments/my` | Get current patient's appointments | Patient |
| **GET** | `/api/appointments` | List all appointments with filters | Admin |
| **PUT** | `/api/appointments/:id/status` | Update status (Pending/Confirmed/etc) | Admin |
| **PUT** | `/api/appointments/:id/cancel` | Cancel upcoming appointment | Patient / Admin |
| **GET** | `/api/patients` | List registered patients & metrics | Admin |

---

## 🎓 Academic Viva Notes

* **Dynamic Slot Calculation**: Time slots (e.g. 09:00 AM, 09:30 AM...) are generated programmatically in `server/utils/slotGenerator.js` based on the doctor's day availability and `slotDuration`.
* **Double Booking Prevention**: Before saving any appointment, Express queries MongoDB for `(doctor, appointmentDate, appointmentTime)` where `status != 'Cancelled'`. If a match is found, an HTTP 400 error is returned with message `"This appointment slot is no longer available."`.
* **Doctor Deactivation vs Deletion**: When a doctor leaves or is deactivated, their status is set to `'inactive'`. This prevents them from appearing in new booking lists while retaining all historical appointment data in MongoDB.
