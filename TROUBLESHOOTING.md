# 🔧 Fix: Environment Variables Issue

## ❌ Problem

Error yang muncul:

```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## 🔍 Root Cause

1. **Environment variables salah**: Menggunakan `SUPABASE_DATABASE_URL` dan `SUPABASE_ANON_KEY`
2. **Next.js requirement**: Client-side environment variables harus menggunakan prefix `NEXT_PUBLIC_`
3. **Server tidak restart**: Perubahan `.env` memerlukan restart development server

## ✅ Solution Applied

### 1. Updated Environment Variables

**Before:**

```env
SUPABASE_DATABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
```

**After:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. Updated Supabase Client

**File**: `supabase/client.ts`

```typescript
// Before
const supabaseUrl = process.env.SUPABASE_DATABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// After
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
```

### 3. Created `.env.local`

Next.js lebih prefer menggunakan `.env.local` untuk local development.

## 🚀 How to Fix

### Step 1: Stop Development Server

Tekan `Ctrl+C` di terminal untuk stop server yang sedang berjalan.

### Step 2: Restart Development Server

```bash
npm run dev
```

### Step 3: Refresh Browser

Setelah server restart, refresh halaman browser (F5 atau Ctrl+R).

## 📝 Why This Happened

### Next.js Environment Variables Rules:

1. **Client-side variables** (digunakan di browser):
   - MUST use `NEXT_PUBLIC_` prefix
   - Example: `NEXT_PUBLIC_SUPABASE_URL`

2. **Server-side variables** (hanya di server):
   - No prefix needed
   - Example: `DATABASE_URL`

3. **Changes require restart**:
   - Environment variables hanya dibaca saat server start
   - Perubahan `.env` memerlukan restart server

### Our Case:

- Kita menggunakan Supabase client di **client-side** (browser)
- Maka harus pakai `NEXT_PUBLIC_` prefix
- Tanpa prefix, Next.js tidak expose variable ke browser
- API endpoint tidak bisa connect ke Supabase
- Return HTML error page instead of JSON

## ✅ Verification Steps

After restarting the server:

1. **Open browser console** (F12)
2. **Navigate to** `/dashboard/users`
3. **Check Network tab**:
   - Should see successful API call to `/api/profile`
   - Response should be JSON, not HTML
4. **Check page**:
   - Should see loading spinner
   - Then see list of users from database

## 🔍 Debugging Tips

If still not working:

### Check 1: Environment Variables Loaded

```typescript
// Add this temporarily in supabase/client.ts
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Has Anon Key:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### Check 2: API Response

```javascript
// In browser console
fetch("/api/profile")
  .then((r) => r.text())
  .then(console.log);
```

Should return JSON like:

```json
{
  "data": [...]
}
```

NOT HTML like:

```html
<!DOCTYPE html> ...
```

### Check 3: Supabase Connection

```javascript
// In browser console
import { supabase } from "@/supabase/client";
const { data, error } = await supabase.from("profile").select("*").limit(1);
console.log({ data, error });
```

## 📚 Files Modified

1. ✅ `.env` - Updated variable names
2. ✅ `.env.local` - Created with correct variables
3. ✅ `supabase/client.ts` - Updated to use NEXT*PUBLIC* prefix

## 🎯 Expected Result

After fix:

- ✅ No more JSON parse errors
- ✅ API returns proper JSON response
- ✅ Users page loads data from database
- ✅ Search and filter work correctly

## 📞 Still Having Issues?

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+Shift+R
3. **Check terminal**: Look for any error messages
4. **Verify Supabase credentials**: Make sure URL and key are correct

---

**Status**: ✅ Fixed
**Action Required**: **RESTART DEVELOPMENT SERVER** (Ctrl+C, then `npm run dev`)
