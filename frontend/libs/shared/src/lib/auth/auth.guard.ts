import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthGuardData, createAuthGuard} from "keycloak-angular";


const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const {authenticated, grantedRoles} = authData

  if (!authenticated) {
    console.debug("Not authenticated, redirecting to forbidden");
    const router = inject(Router)
    return router.parseUrl('/forbidden');
  }

  const requiredRoles: string[] = route.data['roles'] ?? []
  if (requiredRoles.length === 0) {
    return true;
  }

  console.debug("Authenticated: " + authenticated)
  console.debug("Required role: " + requiredRoles)
  const availableRoles = grantedRoles.resourceRoles['admin-app'] ?? []
  console.debug("Available roles: " + availableRoles)

  const hasRoleAccess = requiredRoles.some(requiredRole =>
    availableRoles.includes(requiredRole)
  )

  console.debug("Has role access: " + hasRoleAccess)

  if (hasRoleAccess) {
    return true
  }

  const router = inject(Router)
  return router.parseUrl('/forbidden')
}

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
