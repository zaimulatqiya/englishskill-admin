# Debug Script - Check Database Format

Buka browser console dan jalankan script ini untuk melihat format data di database:

```javascript
// 1. Check debug endpoint
fetch("/api/profile/debug")
  .then((r) => r.json())
  .then((data) => {
    console.log("=== DEBUG DATA ===");
    console.log("Sample Data:", data.sampleData);
    console.log("Unique Years:", data.uniqueYears);
    console.log("Unique Months:", data.uniqueMonths);
    console.log("Data Types:", data.dataTypes);
    console.log("\n=== ANALYSIS ===");

    // Check if months are numbers or names
    const firstMonth = data.uniqueMonths[0];
    if (/^\d+$/.test(firstMonth)) {
      console.log("✅ Months are stored as NUMBERS:", firstMonth);
      console.log("   Format:", firstMonth.length === 1 ? "Unpadded (1-12)" : "Padded (01-12)");
    } else {
      console.log("✅ Months are stored as TEXT:", firstMonth);
    }

    // Check year format
    const firstYear = data.uniqueYears[0];
    console.log("✅ Years are stored as:", typeof firstYear === "number" ? "NUMBER" : "TEXT");
    console.log("   Example:", firstYear);
  });

// 2. Test filter with year only
fetch("/api/profile?tahun=2028")
  .then((r) => r.json())
  .then((data) => {
    console.log("\n=== FILTER BY YEAR 2028 ===");
    console.log("Count:", data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log("Sample:", data.data[0]);
      console.log("Months in 2028:", [...new Set(data.data.map((p) => p.bulan))]);
    }
  });

// 3. Test filter with year + month (as name)
fetch("/api/profile?tahun=2028&bulan=Januari")
  .then((r) => r.json())
  .then((data) => {
    console.log("\n=== FILTER BY 2028 + Januari ===");
    console.log("Count:", data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log("Sample:", data.data[0]);
    } else {
      console.log("❌ NO DATA - Month format mismatch!");
    }
  });

// 4. Test filter with year + month (as number)
fetch("/api/profile?tahun=2028&bulan=1")
  .then((r) => r.json())
  .then((data) => {
    console.log("\n=== FILTER BY 2028 + 1 ===");
    console.log("Count:", data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log("✅ SUCCESS - Months are stored as numbers!");
      console.log("Sample:", data.data[0]);
    }
  });

// 5. Test filter with year + month (as padded number)
fetch("/api/profile?tahun=2028&bulan=01")
  .then((r) => r.json())
  .then((data) => {
    console.log("\n=== FILTER BY 2028 + 01 ===");
    console.log("Count:", data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log("✅ SUCCESS - Months are stored as padded numbers!");
      console.log("Sample:", data.data[0]);
    }
  });
```

## Expected Output:

Setelah menjalankan script di atas, Anda akan melihat:

1. **Format bulan di database** (number atau text)
2. **Format tahun di database** (number atau text)
3. **Test hasil filter** dengan berbagai format

## Next Steps:

Berdasarkan hasil debug:

### If months are stored as numbers (1-12):

- Update frontend to convert "Januari" → "1"
- Update API to handle conversion

### If months are stored as padded numbers (01-12):

- Update frontend to convert "Januari" → "01"
- Update API to handle conversion

### If months are stored as text ("Januari"):

- Check case sensitivity
- Check for typos or extra spaces

---

**Jalankan script ini di browser console untuk melihat format data!**
