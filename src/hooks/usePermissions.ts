
import { useAuth } from "./useAuth";
import type { UserRole } from "../types/auth.types";

export type Permission =
  | "VIEW_ALL_TICKETS"
  | "VIEW_ASSIGNED_TICKETS"
  | "CREATE_TICKET"
  | "EDIT_TICKET"
  | "DELETE_TICKET"
  | "ASSIGN_TICKET"
  | "UPDATE_STATUS"
  | "UPDATE_PRIORITY"
  | "VIEW_ADMIN_DASHBOARD"
  | "VIEW_TEAM_STATISTICS";

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    "VIEW_ALL_TICKETS",
    "VIEW_ASSIGNED_TICKETS",
    "CREATE_TICKET",
    "EDIT_TICKET",
    "DELETE_TICKET",
    "ASSIGN_TICKET",
    "UPDATE_STATUS",
    "UPDATE_PRIORITY",
    "VIEW_ADMIN_DASHBOARD",
    "VIEW_TEAM_STATISTICS",
  ],

 MANAGER: [
  "VIEW_ALL_TICKETS",
  "CREATE_TICKET",
  "EDIT_TICKET",
  "DELETE_TICKET",
  "ASSIGN_TICKET",
  "UPDATE_STATUS",
  "UPDATE_PRIORITY",
  "VIEW_TEAM_STATISTICS",
],

  AGENT: [
    "VIEW_ASSIGNED_TICKETS",
    "UPDATE_STATUS",
  ],
};

export const usePermissions = () => {
  const { user } = useAuth();

  const can = (permission: Permission): boolean => {
    if (!user) return false;

    return rolePermissions[user.role].includes(permission);
  };

  return { can };
};
