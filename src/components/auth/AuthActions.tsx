"use client";

import type { ComponentProps } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Sign-in and sign-out are handled entirely by the Spring Cloud Gateway, so
 * both are plain navigations rather than SDK calls:
 *
 * - `GET /oauth2/authorization/keycloak` starts the authorization-code flow
 * - `POST /logout` clears the gateway session, then Keycloak's RP-initiated
 *   logout ends the IdP session and returns the user to the app
 *
 * No token ever reaches the browser; it only holds the gateway session cookie.
 */

export function KeycloakLoginButton({
  children = "Login",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    // A real anchor, not a Next.js <Link>: the target is the gateway, not a
    // route in this app, so client-side navigation must not intercept it.
    //
    // Where the user lands afterwards is decided by the gateway — the page they
    // were bounced from, or /auth/continue for a plain sign-in.
    <Button render={<a href="/oauth2/authorization/keycloak" />} {...props}>
      <LogIn aria-hidden="true" className="size-4" />
      {children}
    </Button>
  );
}

export function KeycloakLogoutButton({
  children = "Sign out",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <form action="/logout" method="post">
      <Button type="submit" {...props}>
        <LogOut aria-hidden="true" className="size-4" />
        {children}
      </Button>
    </form>
  );
}
