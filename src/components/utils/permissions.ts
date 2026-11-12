
import type { UserRole } from "../../types/auth.types";

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

export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  return rolePermissions[role].includes(permission);
};
