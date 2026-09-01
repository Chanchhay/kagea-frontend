import { isValidElement, type ReactNode } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Up to two letters standing in for an avatar when no photo is set. Falls back
 * to "U" for an empty or unusable name.
 */
export function getInitials(name: string | null | undefined) {
  return (
    (name ?? "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  )
}

/**
 * Base UI button primitives assume a native `<button>` unless told otherwise.
 * When a `render` prop swaps in something else (a `Link`, an `<a>`, ...), the
 * primitive must be told so it can supply the button semantics itself.
 */
export function inferNativeButton(render: ReactNode | ((...args: never[]) => ReactNode) | undefined) {
  if (!isValidElement(render)) return undefined
  // Host elements say what they are; anything with an `href` (`<a>`, `Link`) is a link.
  if (typeof render.type === "string") return render.type === "button"
  if (render.props && typeof render.props === "object" && "href" in render.props) return false
  // Components that aren't links (e.g. our own `Button`) keep the native default.
  return undefined
}
