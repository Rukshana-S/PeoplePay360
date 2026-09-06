import React from "react";
import { useAuth } from "../../context/AuthContext";
import { getRoleDisplayName, getModuleAccess } from "../../utils/rolePermissions";
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react";

const MockRbacNotice = ({ moduleKey, moduleName }) => {
  return null;
};

export default MockRbacNotice;
