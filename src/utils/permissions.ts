
import type { UserRole } from "../types/auth.types";

export type Permission =
  | "VIEW_TICKETS"
  | "VIEW_ALL_TICKETS"
  | "VIEW_ASSIGNED_TICKETS"
  | "CREATE_TICKET"
  | "EDIT_TICKET"
  | "DELETE_TICKET"
  | "ASSIGN_TICKET"
  | "UPDATE_STATUS"
  | "UPDATE_PRIORITY"
  | "VIEW_DASHBOARD"
  | "MANAGE_USERS"
  | "VIEW_TEAM_STATISTICS";

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    "VIEW_TICKETS",
    "VIEW_ALL_TICKETS",
    "VIEW_ASSIGNED_TICKETS",
    "CREATE_TICKET",
    "EDIT_TICKET",
    "DELETE_TICKET",
    "ASSIGN_TICKET",
    "UPDATE_STATUS",
    "UPDATE_PRIORITY",
    "VIEW_DASHBOARD",
    "MANAGE_USERS",
    "VIEW_TEAM_STATISTICS",
  ],

  MANAGER: [
    "VIEW_TICKETS",
    "VIEW_ALL_TICKETS",
    "CREATE_TICKET",
    "EDIT_TICKET",
    "ASSIGN_TICKET",
    "UPDATE_STATUS",
    "UPDATE_PRIORITY",
    "VIEW_DASHBOARD",
    "VIEW_TEAM_STATISTICS",
  ],

  AGENT: [
    "VIEW_TICKETS",
    "VIEW_ASSIGNED_TICKETS",
    "CREATE_TICKET",
    "UPDATE_STATUS",
    "VIEW_DASHBOARD",
  ],
};

export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const getPermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] ?? [];
};
