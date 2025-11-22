# Evallo HRMS – Tutoring Business Automation

A lightweight **Human Resource Management System (HRMS)** built as a full-stack assignment for **Evallo – Tutoring Business Automation**.

The system lets an organisation:

- Create an **organisation account** and admin user
- Manage **employees** (tutors/staff)
- Manage **teams** (batches/squads)
- Assign employees to multiple teams (many-to-many)
- Enforce **authentication & authorisation**
- Maintain an **audit log** of all important actions

## 1. Tech Stack

### Frontend

- **React** (Vite)
- **React Router**
- **Axios** for HTTP
- Plain **CSS**

### Backend

- **Node.js + Express**
- **Sequelize** ORM
- **SQLite** (file-based DB)
- **JWT** for auth
- **bcrypt** for password hashing
- **CORS**, **dotenv**

## 2. Features

### Functional

- **Organisation & Auth**
  - Register organisation + admin user (`/api/auth/register`)
  - Login (`/api/auth/login`)
  - Logout (`/api/auth/logout`)
  - JWT used to protect all data routes

- **Employees**
  - List employees
  - Create, update, delete employees
  - Employee has `firstName`, `lastName`, `email`, `phone`
  - Scoped per organisation (`organisationId`)

- **Teams**
  - List teams
  - Create, update, delete teams
  - Team has `name`, `description`
  - Scoped per organisation

- **Employee ↔ Team assignments**
  - An employee can belong to **multiple teams**
  - A team can contain **multiple employees**
  - UI to assign/unassign employees to a team (checkbox modal)

- **Logging (Audit Trail)**
  - Logs entries for:
    - User login/logout
    - Organisation creation
    - Employee create/update/delete
    - Team create/update/delete
    - Employee assigned/unassigned to team
  - Logs visible in a dedicated **Audit Logs** page

### Non-functional / Architecture

- Clear separation of concerns:
  - `/models` (Sequelize models)
  - `/controllers` (business logic)
  - `/routes` (Express routes)
  - `/middlewares` (auth, error handling)
  - `/pages` and `/components` on frontend
- **Organisation isolation**:
  - All Employee/Team/Log queries are filtered by `organisationId` from the authenticated user
- Ready to scale with minimal refactors (can swap SQLite with Postgres/MySQL by changing Sequelize config).

## 3. Project Structure

EvalloTutoringBusinessAutomation/
├─ server/              # Backend (Node + Express + Sequelize)
│  ├─ index.js          # Express entry
│  ├─ db.js             # Sequelize instance
│  ├─ .env              # Backend env vars
│  ├─ models/
│  │   ├─ organisation.js
│  │   ├─ user.js
│  │   ├─ employee.js
│  │   ├─ team.js
│  │   ├─ employeeTeam.js
│  │   └─ log.js
│  ├─ controllers/
│  │   ├─ authController.js
│  │   ├─ employeeController.js
│  │   └─ teamController.js
│  ├─ routes/
│  │   ├─ auth.js
│  │   ├─ employees.js
│  │   ├─ teams.js
│  │   └─ logs.js
│  └─ middlewares/
│      └─ authMiddleware.js
│
└─ client/              # Frontend (React + Vite)
   ├─ index.html
   ├─ vite.config.js
   ├─ .env              # Frontend env vars
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ index.css
      ├─ services/
      │   └─ api.js
      ├─ context/
      │   └─ AuthContext.jsx
      ├─ components/
      │   ├─ Layout/
      │   │   ├─ Layout.jsx
      │   │   └─ Layout.css
      │   ├─ Navbar/
      │   │   ├─ Navbar.jsx
      │   │   └─ Navbar.css
      │   ├─ EmployeeForm/
      │   │   ├─ EmployeeForm.jsx
      │   │   └─ EmployeeForm.css
      │   ├─ TeamForm/
      │   │   ├─ TeamForm.jsx
      │   │   └─ TeamForm.css
      │   └─ AssignEmployeesModal/
      │       ├─ AssignEmployeesModal.jsx
      │       └─ AssignEmployeesModal.css
      └─ pages/
          ├─ Login/
          │   ├─ Login.jsx
          │   └─ Login.css
          ├─ RegisterOrg/
          │   ├─ RegisterOrg.jsx
          │   └─ RegisterOrg.css
          ├─ Employees/
          │   ├─ Employees.jsx
          │   └─ Employees.css
          ├─ Teams/
          │   ├─ Teams.jsx
          │   └─ Teams.css
          └─ Logs/
              ├─ Logs.jsx
              └─ Logs.css
4. Prerequisites
Node.js v18+ (works with v20)
npm or yarn

No separate DB server needed (uses SQLite file hrms.sqlite)

5. Backend – Setup & Run
5.1 Install dependencies
cd server
npm install
5.2 Environment variables
Create server/.env:

env
PORT=3000
DB_DIALECT=sqlite
DB_STORAGE=./hrms.sqlite
JWT_SECRET=super_long_random_secret
JWT_EXPIRES_IN=8h

# Optional if you wire it:
# FRONTEND_ORIGIN=http://localhost:5173
5.3 Start backend
cd server
node index.js

The server will:
Connect/create hrms.sqlite in the server folder
Auto-sync models (create tables on first run)
Listen on http://localhost:3000
Health check (optional):
curl http://localhost:3000/health

6. Frontend – Setup & Run
6.1 Install dependencies
cd client
npm install
6.2 Environment variables
Create client/.env:
VITE_API_BASE=http://localhost:3000/api
Vite dev server will run at http://localhost:5173 by default.

6.3 Start frontend
cd client
npm run dev
Open the app at:
http://localhost:5173

7. CORS Configuration
The backend is configured to allow the Vite frontend origin.
Example (in server/index.js):

js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
This matches the frontend dev URL (5173) and still lets the frontend talk to the backend at http://localhost:3000/api/....

8. Data Model
Tables (via Sequelize models)
Organisation
id, name, timestamps
User
id, organisationId, name, email, passwordHash, timestamps
Employee
id, organisationId, firstName, lastName, email, phone, timestamps
Team
id, organisationId, name, description, timestamps
EmployeeTeam (join table)
id, employeeId, teamId, assignedAt
Log
id, organisationId, userId, action, meta (JSON), timestamp

Key relationships
Organisation 1-N User
Organisation 1-N Employee
Organisation 1-N Team
Employee N-M Team via EmployeeTeam
Organisation 1-N Log
User 1-N Log
All queries for employees/teams/logs are scoped by organisationId coming from the authenticated user’s JWT.

9. API Overview
All routes are prefixed with /api.

Auth
POST /api/auth/register

Body: { orgName, adminName, email, password }
Creates a new organisation & admin user

Returns: { token, user }
POST /api/auth/login

Body: { email, password }
Returns: { token, user }

POST /api/auth/logout
Protected, logs a user_logged_out event

Auth: Send JWT as Authorization: Bearer <token> for all protected routes.

Employees
GET /api/employees
List all employees for current organisation

GET /api/employees/:id
Get single employee (org-scoped)

POST /api/employees
Body: { firstName, lastName, email?, phone? }

Creates new employee
Adds employee_created log

PUT /api/employees/:id
Updates employee fields
Adds employee_updated log

DELETE /api/employees/:id
Deletes employee
Adds employee_deleted log

Teams
GET /api/teams
List all teams (with Employees included)

POST /api/teams
Body: { name, description? }
Adds team_created log

PUT /api/teams/:id
Updates team fields
Adds team_updated log

DELETE /api/teams/:id
Deletes team
Adds team_deleted log

Employee–Team Assignment
POST /api/teams/:teamId/assign
Body: { employeeId }
Links employee ↔ team
Adds employee_assigned_to_team log

POST /api/teams/:teamId/unassign
Body: { employeeId }
Unlinks employee ↔ team
Adds employee_unassigned_from_team log

Logs
GET /api/logs
Lists recent logs for current organisation (e.g. last 100)
Each entry includes action, meta, and timestamp

10. Frontend UX Flow
Register organisation
Navigate to /register

Fill: organisation name, admin name, email, password
On success, JWT is stored and user is redirected to Employees page

Login
Navigate to /login
Enter email/password of existing admin user

Employees Page
Add new employees via form at top
Edit existing employees
Delete employees
Employee avatar shows initials, ID, and basic details

Teams Page
Add/edit/delete teams
See member count for each team
Click “Assign employees” to open a modal with checkboxes
Save to assign/unassign employees to/from that team

Logs Page
View chronological audit log for key actions
See action name and meta JSON for IDs involved

Logout
Click Logout in the top navbar
Clears JWT & user state, logs user_logged_out

11. Security Notes
Passwords are:
Hashed using bcrypt before saving
Never stored in plain text

Auth:
Stateless, via JWT signed with JWT_SECRET
Token payload: { userId, orgId }

Authorisation:
All protected routes use authMiddleware to:
Verify token
Attach { userId, organisationId } to req.user
All data queries are filtered by organisationId to prevent cross-org access

12. Possible Improvements
Given more time, the following could be added:
Role-based permissions (admin vs normal user)
Pagination & search for large employee/team lists
Filtering & advanced search for logs (by user, date, action)
Better error messages and form validation (both client & server)
Password reset flow and stronger password rules

Docker setup for consistent local/dev environments

13. Running Summary
# Backend
cd server
npm install
node index.js      # http://localhost:3000

# Frontend
cd client
npm install
npm run dev        # http://localhost:5173
Then open http://localhost:5173 and:

Register an organisation
Login (auto after register)
Manage employees, teams, assignments
Check logs for audit history