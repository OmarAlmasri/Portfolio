"use client";

import { useEffect, useState } from "react";

type RotatingRolesProps = {
  roles: string[];
};

export function RotatingRoles({ roles }: RotatingRolesProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex % roles.length] ?? "";
    const atFullLength = !isDeleting && display === current;
    const atEmpty = isDeleting && display.length === 0;

    const timeout = window.setTimeout(() => {
      if (atFullLength) {
        setIsDeleting(true);
        return;
      }

      if (atEmpty) {
        setIsDeleting(false);
        setRoleIndex((value) => (value + 1) % roles.length);
        return;
      }

      setDisplay((value) => {
        if (isDeleting) {
          return value.slice(0, -1);
        }

        return current.slice(0, value.length + 1);
      });
    }, atFullLength ? 1200 : isDeleting ? 40 : 80);

    return () => window.clearTimeout(timeout);
  }, [display, isDeleting, roleIndex, roles]);

  return (
    <span className="typed-role">
      {display}
      <span className="typed-cursor" aria-hidden="true">
        _
      </span>
    </span>
  );
}
