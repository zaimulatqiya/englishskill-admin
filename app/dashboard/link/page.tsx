"use client";

import Link from "next/link";
import { ChevronLeft, Link as LinkIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestToeflForm } from "./components/test-toefl-form";
import { RetakeExamForm } from "./components/retake-exam-form";

export default function LinkPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Decor - Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 w-full bg-white border-b-2 border-black sticky top-0">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between sm:justify-center relative">
          <Link
            href="/dashboard"
            className="group p-2 -ml-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-primary hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all sm:absolute sm:left-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ChevronLeft className="h-6 w-6 text-black group-hover:text-white" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <span className="w-3 h-3 bg-primary border-2 border-black rounded-full block"></span>
            Manajemen Link
          </h1>
          <div className="w-10 sm:hidden"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg md:max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
        <Tabs defaultValue="toefl" className="w-full">
          <TabsList className="w-full h-auto p-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg mb-6">
            <TabsTrigger value="toefl" className="w-1/2 py-2 text-sm font-bold text-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all border-2 border-transparent data-[state=active]:border-black">
              Test TOEFL
            </TabsTrigger>
            <TabsTrigger
              value="retake"
              className="w-1/2 py-2 text-sm font-bold text-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all border-2 border-transparent data-[state=active]:border-black"
            >
              Ujian Ulang
            </TabsTrigger>
          </TabsList>

          <TabsContent value="toefl" className="mt-0 focus-visible:ring-0">
            <TestToeflForm />
          </TabsContent>

          <TabsContent value="retake" className="mt-0 focus-visible:ring-0">
            <RetakeExamForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
