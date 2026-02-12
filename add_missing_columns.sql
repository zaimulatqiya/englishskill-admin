-- Copy and run this SQL command in your Supabase SQL Editor to fix the "Failed to update profile" error.
-- This will add the missing columns required for the new date features.

ALTER TABLE profile 
ADD COLUMN IF NOT EXISTS tanggal_cetak_sertifikat DATE;

ALTER TABLE profile 
ADD COLUMN IF NOT EXISTS expired_date DATE;
