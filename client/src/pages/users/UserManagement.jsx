import React, { useState } from "react";
import { MOCK_USERS } from "../../data/mockUsers";
import { ROLES, ROLE_LABELS, getRoleBadgeClass } from "../../utils/rolePermissions";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { User, ShieldCheck, CheckCircle, X, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Selected User for Side Panel Drawer
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerRole, setDrawerRole] = useState(ROLES.EMPLOYEE);
  const [drawerActive, setDrawerActive] = useState(true);

  const openDrawer = (usr) => {
    setSelectedUser(usr);
    setDrawerRole(usr.role);
    setDrawerActive(usr.status !== "Inactive");
  };

  const closeDrawer = () => {
    setSelectedUser(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, role: drawerRole, status: drawerActive ? "Active" : "Inactive" }
          : u
      )
    );

    toast.success(`User role updated to ${ROLE_LABELS[drawerRole]}!`);
    closeDrawer();
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());

    const matchesRole = selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      <MockRbacNotice moduleKey="users" moduleName="User & Role Management" />

      <PageHeader
        title="User Management"
        subtitle="Manage system access accounts, assign role permissions, and activate/deactivate users"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="Create System User"
        onActionClick={() => openDrawer(MOCK_USERS[0])}
      />

      {/* Role Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1E293B]">
        <button
          type="button"
          onClick={() => setSelectedRoleFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedRoleFilter === "ALL"
              ? "bg-[#5B8DEF] text-white shadow-sm"
              : "text-slate-400 hover:text-white bg-[#0F172A]"
          }`}
        >
          All Accounts ({users.length})
        </button>

        {Object.keys(ROLES).map((rKey) => (
          <button
            key={rKey}
            type="button"
            onClick={() => setSelectedRoleFilter(rKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedRoleFilter === rKey
                ? "bg-[#5B8DEF] text-white shadow-sm"
                : "text-slate-400 hover:text-white bg-[#0F172A]"
            }`}
          >
            {ROLE_LABELS[rKey]}
          </button>
        ))}
      </div>

      {/* User List Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">User Account</th>
              <th className="py-3.5 px-4">Work Email</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Assigned Role</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {filteredUsers.map((usr) => (
              <tr
                key={usr.id}
                onClick={() => openDrawer(usr)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center text-white text-xs">
                    {usr.avatar}
                  </div>
                  <span>{usr.name}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{usr.email}</td>
                <td className="py-3.5 px-4 text-slate-400">{usr.department}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeClass(usr.role)}`}>
                    {ROLE_LABELS[usr.role]}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right text-[#5B8DEF] font-semibold">Edit Permissions →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Panel Drawer for Editing User Permissions */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0F172A] border-l border-[#1E293B] h-full p-6 space-y-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Edit User Permissions</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Account</label>
                <div className="p-3 bg-[#020817] border border-[#1E293B] rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center text-white font-bold text-xs">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{selectedUser.name}</p>
                    <p className="text-xs text-slate-400">{selectedUser.title}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Assign Role</label>
                <div className="space-y-2">
                  {Object.keys(ROLES).map((rKey) => (
                    <label
                      key={rKey}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        drawerRole === rKey
                          ? "bg-[#5B8DEF]/10 border-[#5B8DEF] text-white"
                          : "bg-[#020817] border-[#1E293B] text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="role"
                          value={rKey}
                          checked={drawerRole === rKey}
                          onChange={() => setDrawerRole(rKey)}
                          className="text-[#5B8DEF] focus:ring-0"
                        />
                        <span className="font-bold text-xs text-slate-200">{ROLE_LABELS[rKey]}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getRoleBadgeClass(rKey)}`}>
                        {rKey}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Account Status</label>
                <div className="flex items-center justify-between p-3 bg-[#020817] border border-[#1E293B] rounded-xl">
                  <span className="text-xs font-semibold text-white">Active System Access</span>
                  <input
                    type="checkbox"
                    checked={drawerActive}
                    onChange={(e) => setDrawerActive(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E293B] text-[#5B8DEF] focus:ring-0"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E293B] flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDrawer}
                  className="w-1/2 border-[#1E293B] text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Save Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
