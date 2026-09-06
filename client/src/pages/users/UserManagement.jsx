import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../hooks/useUsers";
import { ROLES, ROLE_LABELS, getRoleBadgeClass } from "../../utils/rolePermissions";
import PageHeader from "../../components/shared/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import ConfirmDeleteDialog from "../../components/shared/ConfirmDeleteDialog";
import { User, ShieldCheck, CheckCircle, X, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();
  const [search, setSearch] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Selected User for Side Panel Drawer
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerRole, setDrawerRole] = useState(ROLES.EMPLOYEE);
  const [drawerActive, setDrawerActive] = useState(true);

  // Create User Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState(ROLES.EMPLOYEE);

  // Delete User Dialog
  const [deleteId, setDeleteId] = useState(null);

  const openDrawer = (usr) => {
    setSelectedUser(usr);
    setDrawerRole(usr.role);
    setDrawerActive(usr.status === "ACTIVE");
  };

  const closeDrawer = () => {
    setSelectedUser(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const res = await editUser(selectedUser.id, {
      role: drawerRole,
      status: drawerActive ? "ACTIVE" : "INACTIVE"
    });
    if (res.success) {
      toast.success("User updated");
      closeDrawer();
    } else {
      toast.error(res.error || "Failed to update user");
    }
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    const res = await addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
    });
    if (res.success) {
      toast.success("User created");
      setNewUserName("");
      setNewUserEmail("");
      setIsCreateModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase());

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
        onActionClick={() => setIsCreateModalOpen(true)}
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
      {loading ? (
        <div className="text-white p-6">Loading users...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={User}
          title="No users found"
          description="Create a system user account."
          actionLabel="Create User"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">User Account</th>
                <th className="py-3.5 px-4">Work Email</th>
                <th className="py-3.5 px-4">Status</th>
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
                      {usr.name ? usr.name.charAt(0) : "U"}
                    </div>
                    <span>{usr.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{usr.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${usr.status === "ACTIVE" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" : "text-slate-500 bg-slate-800 border border-slate-700"}`}>
                      {usr.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeClass(usr.role)}`}>
                      {ROLE_LABELS[usr.role] || usr.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openDrawer(usr)}
                      className="text-[#5B8DEF] hover:underline font-semibold"
                    >
                      Edit →
                    </button>
                    <button
                      onClick={() => setDeleteId(usr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create System User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Create System User Account</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@peoplepay360.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assign Access Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                >
                  {Object.keys(ROLES).map((rKey) => (
                    <option key={rKey} value={rKey}>
                      {ROLE_LABELS[rKey]} ({rKey})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-transparent border border-[#1E293B] text-slate-300 hover:bg-slate-800 px-4 h-9 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white px-4 h-9 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create User Account</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete User Dialog */}
      {deleteId && (
        <ConfirmDeleteDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            const res = await removeUser(deleteId);
            if (res.success) {
              toast.success("User deleted");
            } else {
              toast.error(res.error || "Failed to delete user");
            }
            setDeleteId(null);
          }}
          title="Delete System User Account"
          description="Are you sure you want to remove this user account from the system?"
        />
      )}

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
                    {selectedUser.name ? selectedUser.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{selectedUser.name}</p>
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
