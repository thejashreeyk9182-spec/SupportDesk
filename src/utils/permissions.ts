import type { UserRole } from "../types/auth.types";

export type Permission =
  | "VIEW_TICKETS"
  | "CREATE_TICKET"
  | "EDIT_TICKET"
  | "DELETE_TICKET"
  | "ASSIGN_TICKET"
  | "UPDATE_STATUS"
  | "UPDATE_PRIORITY"
  | "VIEW_DASHBOARD";

// Permissions assigned to each role
const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    "VIEW_TICKETS",
    "CREATE_TICKET",
    "EDIT_TICKET",
    "DELETE_TICKET",
    "ASSIGN_TICKET",
    "UPDATE_STATUS",
    "UPDATE_PRIORITY",
    "VIEW_DASHBOARD",
  ],

 MANAGER: [
  "VIEW_TICKETS",
  "CREATE_TICKET",
  "EDIT_TICKET",
  "DELETE_TICKET",
  "ASSIGN_TICKET",
  "UPDATE_STATUS",
  "UPDATE_PRIORITY",
  "VIEW_DASHBOARD",
],

  AGENT: [
    "VIEW_TICKETS",
    "UPDATE_STATUS",
  ],
};

// Check whether a role has a particular permission
export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};

// Get all permissions for a role
export const getPermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] ?? [];
};
