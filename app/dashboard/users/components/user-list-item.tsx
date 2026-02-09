"use client";

import { ChevronRight, Phone, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";

interface UserListItemProps {
  user: Profile;
  onClick: () => void;
}

export function UserListItem({ user, onClick }: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      className="w-full max-w-full group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:gap-4 sm:p-4"
    >
      <div className="flex flex-1 items-center gap-3 overflow-hidden min-w-0 sm:gap-4">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-white sm:h-12 sm:w-12">
          <User className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>

        {/* User Info */}
        <div className="flex flex-col overflow-hidden justify-center">
          <span className="truncate text-sm font-black text-black sm:text-lg leading-tight">{user.nama}</span>
          <div className="flex flex-col text-xs font-medium text-slate-600 sm:flex-row sm:items-center sm:gap-4 sm:text-sm mt-0.5">
            {user.nomor_whatsapp && (
              <>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {user.nomor_whatsapp}
                </span>
                <span className="hidden text-slate-400 sm:inline">•</span>
              </>
            )}
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3" />
              {user.email}
            </span>
          </div>
        </div>
      </div>

      {/* Action Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-transparent text-black transition-colors group-hover:border-black group-hover:bg-primary group-hover:text-white sm:h-10 sm:w-10">
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    </div>
  );
}
