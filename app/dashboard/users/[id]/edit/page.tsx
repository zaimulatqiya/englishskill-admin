"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, X, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getProfileById, updateProfile } from "@/lib/profile-api";
import { Profile, UpdateProfilePayload } from "@/types/profile";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile | null>(null);

  // Form States
  const [formData, setFormData] = React.useState({
    nama: "",
    email: "",
    nomor_whatsapp: "",
    tempat_lahir: "",
  });
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // Score States
  const [scores, setScores] = React.useState({
    score1: {
      listening: "",
      structure: "",
      reading: "",
      total: "",
    },
    score2: {
      listening: "",
      structure: "",
      reading: "",
      total: "",
    },
  });

  // Fetch user data
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getProfileById(id);

        if (data) {
          setProfile(data);

          // Initialize form data
          setFormData({
            nama: data.nama || "",
            email: data.email || "",
            nomor_whatsapp: data.nomor_whatsapp || "",
            tempat_lahir: data.tempat_lahir || "",
          });

          // Initialize date
          if (data.tanggal_lahir) {
            setDate(new Date(data.tanggal_lahir));
          }

          // Initialize scores
          setScores({
            score1: {
              listening: data.score_listening?.toString() || "",
              structure: data.score_structure?.toString() || "",
              reading: data.score_reading?.toString() || "",
              total: data.total_score?.toString() || "",
            },
            score2: {
              listening: data.score_listening2?.toString() || "",
              structure: data.score_structure2?.toString() || "",
              reading: data.score_reading2?.toString() || "",
              total: data.total_score2?.toString() || "",
            },
          });
        } else {
          toast.error("User tidak ditemukan");
          router.push("/dashboard/users");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  // Handle Score Change and Auto Calculate Total
  const handleScoreChange = (scoreType: "score1" | "score2", field: "listening" | "structure" | "reading", value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    setScores((prev) => {
      const currentScore = { ...prev[scoreType], [field]: value };

      // Auto calculate total if all 3 fields have values
      const l = parseInt(currentScore.listening || "0");
      const s = parseInt(currentScore.structure || "0");
      const r = parseInt(currentScore.reading || "0");

      let total = prev[scoreType].total;

      // Calculate total even if not all filled, treat empty as 0?
      // Usually better to wait for all, but for edit convenience, let's calc if any is present or just rely on manual edits?
      // User asked "sesuaikan dengan yang ada di database".
      // Let's replicate the logic: ((structure + listening + reading) / 3) * 10

      if (currentScore.listening || currentScore.structure || currentScore.reading) {
        const calculated = ((l + s + r) / 3) * 10;
        // Format to 1 decimal place or integer? usually TOEFL is integer.
        // Database has float4.
        total = Math.round(calculated).toString();
      }

      return {
        ...prev,
        [scoreType]: {
          ...currentScore,
          total,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const payload: UpdateProfilePayload = {
        id: profile.id,
        nama: formData.nama,
        email: formData.email,
        nomor_whatsapp: formData.nomor_whatsapp,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: date ? format(date, "yyyy-MM-dd") : null,

        // Score 1
        score_listening: scores.score1.listening ? parseInt(scores.score1.listening) : null,
        score_structure: scores.score1.structure ? parseInt(scores.score1.structure) : null,
        score_reading: scores.score1.reading ? parseInt(scores.score1.reading) : null,
        total_score: scores.score1.total ? parseFloat(scores.score1.total) : null,

        // Score 2
        score_listening2: scores.score2.listening ? parseInt(scores.score2.listening) : null,
        score_structure2: scores.score2.structure ? parseInt(scores.score2.structure) : null,
        score_reading2: scores.score2.reading ? parseInt(scores.score2.reading) : null,
        total_score2: scores.score2.total ? parseFloat(scores.score2.total) : null,
      };

      await updateProfile(payload);
      toast.success("Data berhasil disimpan");
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const scoreTabs = [
    { id: "score1", label: "Score 1" },
    { id: "score2", label: "Score 2" },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* Header */}
      <header className="relative z-50 w-full bg-white border-b-2 border-black sticky top-0 shadow-sm flex-none">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between sm:justify-center relative">
          <Link
            href="/dashboard/users"
            className="group p-2 -ml-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-primary hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all sm:absolute sm:left-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ChevronLeft className="h-6 w-6 text-black group-hover:text-white" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">Edit User: {profile.nama}</h1>
          <div className="w-10 sm:hidden"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto sm:overflow-hidden relative z-0">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Personal Info Section */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="relative group">
              <Label htmlFor="name" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
            {/* Email */}
            <div className="relative group">
              <Label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
            {/* Phone */}
            <div className="relative group">
              <Label htmlFor="phone" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Nomor Whatsapp
              </Label>
              <Input
                id="phone"
                value={formData.nomor_whatsapp}
                onChange={(e) => setFormData({ ...formData, nomor_whatsapp: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
            {/* Birth Place */}
            <div className="relative group">
              <Label htmlFor="birthPlace" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Tempat Lahir
              </Label>
              <Input
                id="birthPlace"
                value={formData.tempat_lahir}
                onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
          </div>

          {/* Date of Birth Picker (Full Width Button) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-14 justify-center text-left font-black text-white bg-black border-2 border-black hover:bg-slate-800 hover:text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-wider text-lg",
                  !date && "text-muted-foreground",
                )}
              >
                {date ? format(date, "PPP", { locale: idLocale }) : <span>Pilih Tanggal Lahir</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={idLocale} />
            </PopoverContent>
          </Popover>

          {/* Scores Tabs */}
          <Tabs defaultValue="score1" className="w-full mt-4">
            <TabsList className="w-full justify-between bg-transparent p-0 border-b-2 border-slate-200 h-auto rounded-none mb-6">
              {scoreTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 rounded-none border-b-4 border-transparent px-4 py-3 text-sm font-bold text-slate-400 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:bg-transparent transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {scoreTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Listening */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Listening</Label>
                  <div className="relative">
                    <Input
                      value={scores[tab.id as keyof typeof scores].listening}
                      onChange={(e) => handleScoreChange(tab.id as "score1" | "score2", "listening", e.target.value)}
                      className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
                      placeholder="Contoh: 50"
                    />
                    {scores[tab.id as keyof typeof scores].listening && (
                      <button onClick={() => handleScoreChange(tab.id as "score1" | "score2", "listening", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Structure */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Structure</Label>
                  <div className="relative">
                    <Input
                      value={scores[tab.id as keyof typeof scores].structure}
                      onChange={(e) => handleScoreChange(tab.id as "score1" | "score2", "structure", e.target.value)}
                      className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
                      placeholder="Contoh: 50"
                    />
                    {scores[tab.id as keyof typeof scores].structure && (
                      <button onClick={() => handleScoreChange(tab.id as "score1" | "score2", "structure", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Reading */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Reading</Label>
                  <div className="relative">
                    <Input
                      value={scores[tab.id as keyof typeof scores].reading}
                      onChange={(e) => handleScoreChange(tab.id as "score1" | "score2", "reading", e.target.value)}
                      className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
                      placeholder="Contoh: 50"
                    />
                    {scores[tab.id as keyof typeof scores].reading && (
                      <button onClick={() => handleScoreChange(tab.id as "score1" | "score2", "reading", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Total Score Section */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Total Score (Auto Calculated)</Label>
                  <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 font-black text-lg text-black h-14 flex items-center">{scores[tab.id as keyof typeof scores].total || "0"}</div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-2 mb-8">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-14 rounded-xl border-2 border-black bg-slate-800 text-white font-bold text-lg hover:bg-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan
                </>
              )}
            </Button>
            <Button className="h-14 rounded-xl border-2 border-black bg-white text-black font-bold text-lg hover:bg-slate-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
              Download Sertifikat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
