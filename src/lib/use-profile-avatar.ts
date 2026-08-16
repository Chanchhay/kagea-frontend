"use client";

import { useEffect, useState } from "react";

export const PROFILE_AVATAR_EVENT = "profile-avatar-updated";

export function saveProfileAvatar(accountId: number, url: string) {
  const storageKey = `profile-avatar-${accountId}`;
  if (url) localStorage.setItem(storageKey, url);
  else localStorage.removeItem(storageKey);
  window.dispatchEvent(new CustomEvent(PROFILE_AVATAR_EVENT, { detail: url }));
}

/** Keeps the locally uploaded recruiter avatar in sync across every shell. */
export function useProfileAvatar(accountId?: number, fallback?: string | null) {
  const [uploadedAvatar, setUploadedAvatar] = useState("");

  useEffect(() => {
    if (!accountId) return;
    const storageKey = `profile-avatar-${accountId}`;
    const legacyRecruiterKey = `recruiter-avatar-${accountId}`;
    if (fallback && !localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, fallback);
    }
    const sync = (event?: Event) => {
      const update = event as CustomEvent<string> | undefined;
      setUploadedAvatar(
        update?.detail ||
          localStorage.getItem(storageKey) ||
          localStorage.getItem(legacyRecruiterKey) ||
          "",
      );
    };

    queueMicrotask(() => sync());
    window.addEventListener(PROFILE_AVATAR_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROFILE_AVATAR_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [accountId, fallback]);

  return uploadedAvatar || fallback || "";
}
