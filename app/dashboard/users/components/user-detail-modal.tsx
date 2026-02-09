"use client";

import { X, ChevronRight, User, Phone, Mail, Award, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";

interface UserDetailModalProps {
  user: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
  // Define exam data based on user's profile
  const exam1 = [
    { name: "Reading", completed: user.reading, score: user.score_reading },
    { name: "Listening", completed: user.listening, score: user.score_listening },
    { name: "Structure", completed: user.structure, score: user.score_structure },
  ];

  const exam2 = [
    { name: "Reading", completed: user.reading2, score: user.score_reading2 },
    { name: "Listening", completed: user.listening2, score: user.score_listening2 },
    { name: "Structure", completed: user.structure2, score: user.score_structure2 },
  ];

  const hasExam1 = user.reading || user.listening || user.structure;
  const hasExam2 = user.reading2 || user.listening2 || user.structure2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 bg-white p-0 overflow-hidden fixed top-auto bottom-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full rounded-t-2xl rounded-b-none border-x-2 border-t-2 border-b-0 border-black data-[state=open]:slide-in-from-bottom-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-bottom-100 data-[state=closed]:zoom-out-100 sm:max-w-4xl sm:left-1/2 sm:-translate-x-1/2 sm:right-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black p-6 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <User className="h-8 w-8 text-black" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-black">{user.nama}</DialogTitle>
              <p className="text-sm font-medium text-slate-500">{user.email}</p>
              {user.nomor_whatsapp && (
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" />
                  {user.nomor_whatsapp}
                </p>
              )}
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="rounded-lg border-2 border-transparent p-1 transition-all hover:border-black hover:bg-red-500 hover:text-white cursor-pointer">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Account Settings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Settings</h4>
            <Link
              href={`/dashboard/users/${user.id}/edit`}
              className="group flex cursor-pointer items-center justify-between rounded-lg border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <span className="font-bold text-black flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </span>
              <ChevronRight className="h-5 w-5 text-black transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Scores Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Informasi Skor</h4>

            {/* Total Scores */}
            <div className="grid grid-cols-2 gap-3">
              {user.total_score !== null && (
                <div className="rounded-lg border-2 border-black bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-slate-600 mb-1">Total Skor 1</p>
                  <p className="text-2xl font-black text-black">{user.total_score.toFixed(1)}</p>
                </div>
              )}
              {user.total_score2 !== null && (
                <div className="rounded-lg border-2 border-black bg-gradient-to-br from-green-50 to-green-100 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-slate-600 mb-1">Total Skor 2</p>
                  <p className="text-2xl font-black text-black">{user.total_score2.toFixed(1)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Scores Tabs */}
          {(hasExam1 || hasExam2) && (
            <Tabs defaultValue={hasExam1 ? "exam1" : "exam2"} className="w-full">
              <TabsList className="w-full justify-start rounded-lg border-2 border-black bg-slate-100 p-1 h-auto flex-wrap gap-1">
                {hasExam1 && (
                  <TabsTrigger value="exam1" className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                    Ujian 1
                  </TabsTrigger>
                )}
                {hasExam2 && (
                  <TabsTrigger value="exam2" className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                    Ujian 2
                  </TabsTrigger>
                )}
              </TabsList>

              {hasExam1 && (
                <TabsContent value="exam1" className="mt-4 space-y-3">
                  {exam1.map((exam) => (
                    <div key={`exam1-${exam.name}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <span className="text-sm font-bold text-black">Ujian {exam.name}</span>
                        {exam.score !== null && <p className="text-xs text-slate-500 mt-0.5">Skor: {exam.score}</p>}
                      </div>
                      {exam.completed ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                      ) : (
                        <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                      )}
                    </div>
                  ))}
                </TabsContent>
              )}

              {hasExam2 && (
                <TabsContent value="exam2" className="mt-4 space-y-3">
                  {exam2.map((exam) => (
                    <div key={`exam2-${exam.name}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <span className="text-sm font-bold text-black">Ujian {exam.name}</span>
                        {exam.score !== null && <p className="text-xs text-slate-500 mt-0.5">Skor: {exam.score}</p>}
                      </div>
                      {exam.completed ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                      ) : (
                        <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                      )}
                    </div>
                  ))}
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black bg-slate-50 p-4">
          {user.nomor_whatsapp ? (
            <Button
              onClick={() => {
                const phoneNumber = user.nomor_whatsapp?.replace(/^0/, "62") ?? "";
                window.open(`https://wa.me/${phoneNumber}`, "_blank");
              }}
              className="w-full rounded-lg border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-bold text-lg h-12"
            >
              <Phone className="mr-2 h-5 w-5" />
              Hubungi via WhatsApp
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = `mailto:${user.email}`)}
              className="w-full rounded-lg border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-bold text-lg h-12"
            >
              <Mail className="mr-2 h-5 w-5" />
              Hubungi via Email
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
