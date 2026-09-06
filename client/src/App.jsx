import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Guards
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Module 1: Employees
import EmployeesKanban from "./pages/employees/EmployeesKanban";
import EmployeesList from "./pages/employees/EmployeesList";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeCreate from "./pages/employees/EmployeeCreate";
import EmployeeEdit from "./pages/employees/EmployeeEdit";
import EmployeeContracts from "./pages/employees/EmployeeContracts";
import EmployeeAttendance from "./pages/employees/EmployeeAttendance";
import EmployeeTimeOff from "./pages/employees/EmployeeTimeOff";

// Module 2: Contracts
import ContractList from "./pages/contracts/ContractList";
import ContractForm from "./pages/contracts/ContractForm";
import ContractCreate from "./pages/contracts/ContractCreate";
import ContractEdit from "./pages/contracts/ContractEdit";

// Module 3: Schedules
import ScheduleList from "./pages/schedules/ScheduleList";
import ScheduleForm from "./pages/schedules/ScheduleForm";

// Module 4: Attendance
import AttendanceList from "./pages/attendance/AttendanceList";
import AttendanceForm from "./pages/attendance/AttendanceForm";
import AttendanceCreate from "./pages/attendance/AttendanceCreate";

import TimeOffRequests from "./pages/timeoff/TimeOffRequests";
import TimeOffRequestForm from "./pages/timeoff/TimeOffRequestForm";
import TimeOffApprovals from "./pages/timeoff/TimeOffApprovals";
import TimeOffAllocations from "./pages/timeoff/TimeOffAllocations";
import LeaveTypes from "./pages/timeoff/LeaveTypes";

// Module 6: Payroll
import PayrunList from "./pages/payroll/PayrunList";
import PayrunWizard from "./pages/payroll/PayrunWizard";
import PayrunProcessing from "./pages/payroll/PayrunProcessing";
import PayslipList from "./pages/payroll/PayslipList";
import PayslipView from "./pages/payroll/PayslipView";
import SalaryStructureList from "./pages/payroll/SalaryStructureList";
import SalaryStructureForm from "./pages/payroll/SalaryStructureForm";
import SalaryRuleList from "./pages/payroll/SalaryRuleList";
import SalaryRuleForm from "./pages/payroll/SalaryRuleForm";

// Module 7: Reports
import ReportsDashboard from "./pages/reports/ReportsDashboard";

// Module 8: User Management
import UserManagement from "./pages/users/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected ERP Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Module 1: Employees */}
            <Route path="/employees" element={<EmployeesKanban />} />
            <Route path="/employees/list" element={<EmployeesList />} />
            <Route path="/employees/new" element={<EmployeeCreate />} />
            <Route path="/employees/:id" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeEdit />} />
            <Route path="/employees/:id/contracts" element={<EmployeeContracts />} />
            <Route path="/employees/:id/attendance" element={<EmployeeAttendance />} />
            <Route path="/employees/:id/timeoff" element={<EmployeeTimeOff />} />
            <Route path="/profile" element={<EmployeeForm />} />

            {/* Module 2: Contracts */}
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/new" element={<ContractCreate />} />
            <Route path="/contracts/:id" element={<ContractForm />} />
            <Route path="/contracts/:id/edit" element={<ContractEdit />} />

            {/* Module 3: Working Schedules */}
            <Route path="/working-schedules" element={<ScheduleList />} />
            <Route path="/working-schedules/:id" element={<ScheduleForm />} />

            {/* Module 4: Attendance */}
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/attendance/new" element={<AttendanceCreate />} />
            <Route path="/attendance/:id" element={<AttendanceForm />} />


            {/* Module 5: Time Off */}
            <Route path="/time-off/requests" element={<TimeOffRequests />} />
            <Route path="/time-off/requests/:id" element={<TimeOffRequestForm />} />
            <Route path="/time-off/approvals" element={<TimeOffApprovals />} />
            <Route path="/time-off/allocations" element={<TimeOffAllocations />} />
            <Route path="/time-off/types" element={<LeaveTypes />} />

            {/* Module 6: Payroll */}
            <Route path="/payroll/payruns" element={<PayrunList />} />
            <Route path="/payroll/payruns/new" element={<PayrunWizard />} />
            <Route path="/payroll/payruns/:id" element={<PayrunProcessing />} />
            <Route path="/payroll/payslips" element={<PayslipList />} />
            <Route path="/payroll/payslips/:id" element={<PayslipView />} />
            <Route path="/payroll/structures" element={<SalaryStructureList />} />
            <Route path="/payroll/structures/:id" element={<SalaryStructureForm />} />
            <Route path="/payroll/rules" element={<SalaryRuleList />} />
            <Route path="/payroll/rules/:id" element={<SalaryRuleForm />} />

            {/* Module 7: Reports */}
            <Route path="/reports" element={<ReportsDashboard />} />

            {/* Module 8: User Management */}
            <Route path="/users" element={<UserManagement />} />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;