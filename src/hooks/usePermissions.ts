
import { useAuth } from "./useAuth";
import {
  hasPermission,
  type Permission,
} from "../utils/permissions";

export const usePermissions = () => {
  const { user } = useAuth();

  const can = (permission: Permission): boolean => {
    if (!user) return false;

    return hasPermission(user.role, permission);
  };

  return { can };
};
