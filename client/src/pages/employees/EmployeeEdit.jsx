import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmployees } from "../../hooks/useEmployees";
import { useMasterData } from "../../hooks/useMasterData";
import PageHeader from "../../components/shared/PageHeader";
import FormActions from "../../components/shared/FormActions";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import * as api from "../../api/employees";

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateEmployee, employees } = useEmployees();
  const { departments, jobPositions, schedules, loading: masterLoading } = useMasterData();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    jobPositionId: "",
    managerId: "",
    scheduleId: "",
    status: "",
    employeeType: "",
    hireDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await api.getEmployeeById(id);
        const emp = res.data || res;
        setEmployee(emp);
        setFormData({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: emp.email || "",
          phone: emp.phone || "",
          departmentId: emp.departmentId || "",
          jobPositionId: emp.jobPositionId || "",
          managerId: emp.managerId || "",
          scheduleId: emp.scheduleId || "",
          status: emp.status || "ACTIVE",
          employeeType: emp.employeeType || "FULL_TIME",
          hireDate: emp.hireDate ? new Date(emp.hireDate).toISOString().split("T")[0] : "",
        });
      } catch (err) {
        toast.error("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmp();
  }, [id]);

  const checkCircular = (empId, targetManagerId) => {
    if (empId === targetManagerId) return true;
    let currentManagerId = targetManagerId;
    while(currentManagerId) {
        const manager = employees?.find(e => e.id === currentManagerId);
        if (!manager) break;
        if (manager.id === empId || manager.managerId === empId) return true;
        currentManagerId = manager.managerId;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let newErrors = {};

    if (!formData.departmentId) newErrors.departmentId = "Department is required.";
    if (!formData.jobPositionId) newErrors.jobPositionId = "Job Position is required.";
    
    const selectedPosition = jobPositions.find(jp => jp.id === formData.jobPositionId);
    const isExecutive = selectedPosition && (selectedPosition.title.includes("Admin") || selectedPosition.title.includes("HR Manager"));
    
    if (!isExecutive && !formData.managerId) {
      newErrors.managerId = "Regular employees must select a manager.";
    }

    if (formData.managerId) {
      if (formData.managerId === id) {
        newErrors.managerId = "Employee cannot be their own manager.";
      } else if (checkCircular(id, formData.managerId)) {
        newErrors.managerId = "Circular reporting hierarchy detected.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    const payload = { ...formData };
    if (!payload.managerId) payload.managerId = null;
    if (!payload.scheduleId) payload.scheduleId = null;
    
    if (payload.hireDate) {
        payload.hireDate = new Date(payload.hireDate).toISOString();
    }

    const res = await updateEmployee(id, payload);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Employee updated successfully!");
      navigate(`/employees/${id}`);
    } else {
      toast.error(res.error || "Failed to update employee.");
    }
  };

  if (loading || masterLoading) {
    return <div className="text-white p-6">Loading form data...</div>;
  }

  if (!employee) {
    return <div className="text-white p-6">Employee not found.</div>;
  }

  const availableManagers = employees?.filter(emp => emp.id !== id && emp.status === 'ACTIVE') || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={`Edit Employee: ${employee.firstName} ${employee.lastName}`}
        subtitle={`Code: ${employee.employeeCode}`}
        showBack
        backPath={`/employees/${employee.id}`}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#1E293B]">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Edit Employee Profile</h2>
              <p className="text-xs text-slate-400">Update employee details and organizational assignments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Work Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hire Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  required
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Employment Type</label>
              <select
                value={formData.employeeType}
                onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="INTERN">Intern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className={`w-full p-2.5 bg-[#020817] border ${errors.departmentId ? 'border-rose-500' : 'border-[#1E293B]'} rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none`}
              >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="text-rose-500 text-xs mt-1">{errors.departmentId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Job Position *</label>
              <select
                required
                value={formData.jobPositionId}
                onChange={(e) => setFormData({ ...formData, jobPositionId: e.target.value })}
                className={`w-full p-2.5 bg-[#020817] border ${errors.jobPositionId ? 'border-rose-500' : 'border-[#1E293B]'} rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none`}
              >
                <option value="">Select Job Position</option>
                {jobPositions?.map((pos) => (
                  <option key={pos.id} value={pos.id}>{pos.title}</option>
                ))}
              </select>
              {errors.jobPositionId && <p className="text-rose-500 text-xs mt-1">{errors.jobPositionId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Manager</label>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                className={`w-full p-2.5 bg-[#020817] border ${errors.managerId ? 'border-rose-500' : 'border-[#1E293B]'} rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none`}
              >
                <option value="">None</option>
                {availableManagers?.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
              {errors.managerId && <p className="text-rose-500 text-xs mt-1">{errors.managerId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Working Schedule</label>
              <select
                value={formData.scheduleId}
                onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="">Select Schedule</option>
                {schedules?.map((sch) => (
                  <option key={sch.id} value={sch.id}>{sch.name} ({sch.weeklyHours}h)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Work Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>

          <FormActions
            onCancel={() => navigate(`/employees/${employee.id}`)}
            isSubmitting={isSubmitting}
            saveLabel="Update Record"
          />
        </form>
      </div>
    </div>
  );
};

export default EmployeeEdit;
