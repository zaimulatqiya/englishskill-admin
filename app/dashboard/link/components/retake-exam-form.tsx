"use client";

import { useEffect, useState } from "react";
import { Instagram, Users, User, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LinkData {
  id: number | null;
  postingan_instagram: string;
  akun_instagram: string;
  grup: string;
}

export function RetakeExamForm() {
  const [formData, setFormData] = useState<LinkData>({
    id: null,
    postingan_instagram: "",
    akun_instagram: "",
    grup: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchLinkData();
  }, []);

  const fetchLinkData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/link/ujian-ulang");
      const result = await response.json();

      if (response.ok) {
        setFormData(result.data);
      } else {
        toast.error(result.error || "Gagal memuat data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URLs
    if (!formData.postingan_instagram || !formData.akun_instagram || !formData.grup) {
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      setSaving(true);

      const method = formData.id ? "PUT" : "POST";
      console.log("Submitting form:", { method, formData });

      const response = await fetch("/api/link/ujian-ulang", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("API Response:", { status: response.status, result });

      if (response.ok) {
        toast.success("Data berhasil disimpan");
        // Update form with returned data
        if (result.data && result.data.length > 0) {
          setFormData(result.data[0]);
        }
      } else {
        const errorMsg = result.details ? `${result.error}: ${result.details}` : result.error || "Gagal menyimpan data";
        toast.error(errorMsg);
        console.error("API Error:", result);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof LinkData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="text-xl font-black">Link Ujian Ulang</CardTitle>
          <CardDescription>Kelola link untuk peserta Ujian Ulang (Postingan IG, Akun IG, dan Grup).</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle className="text-xl font-black">Link Ujian Ulang</CardTitle>
        <CardDescription>Kelola link untuk peserta Ujian Ulang (Postingan IG, Akun IG, dan Grup).</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ig-post" className="font-bold">
              Link Postingan Instagram
            </Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="ig-post"
                placeholder="https://instagram.com/p/..."
                className="pl-9 border-2 border-black focus-visible:ring-0 focus-visible:border-primary"
                value={formData.postingan_instagram}
                onChange={(e) => handleInputChange("postingan_instagram", e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ig-account" className="font-bold">
              Link Akun Instagram
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="ig-account"
                placeholder="https://instagram.com/username..."
                className="pl-9 border-2 border-black focus-visible:ring-0 focus-visible:border-primary"
                value={formData.akun_instagram}
                onChange={(e) => handleInputChange("akun_instagram", e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="retake-group" className="font-bold">
              Link Grup
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="retake-group"
                placeholder="https://chat.whatsapp.com/..."
                className="pl-9 border-2 border-black focus-visible:ring-0 focus-visible:border-primary"
                value={formData.grup}
                onChange={(e) => handleInputChange("grup", e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={saving}
            className="w-full my-4 md:w-auto md:ml-auto md:px-8 md:my-4 border-2 border-black bg-primary text-primary-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Data
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
