"use client";

import React, { useEffect, useState } from "react";

interface DashboardFooterProps {
  email?: string;
}

export function DashboardFooter({ email: defaultEmail = "student@skill.edu" }: DashboardFooterProps) {
  const [displayEmail, setDisplayEmail] = useState(defaultEmail);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setDisplayEmail(storedEmail);
    }
  }, []);

  return (
    <div className="mt-16 text-center">
      <p className="text-xs text-slate-400">
        Logged in as <span className="font-medium text-slate-600">{displayEmail}</span>
      </p>
    </div>
  );
}
