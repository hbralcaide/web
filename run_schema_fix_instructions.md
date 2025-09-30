# Database Schema Fix Instructions

## 🚨 URGENT: Run this SQL script to fix the database schema issues

The vendor credential setup is failing because the `vendor_profiles` table is missing required columns.

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix_vendor_profiles_schema.sql`
4. Click **Run**

### Option 2: Command Line
```bash
psql "postgresql://postgres.udxoepcssfhljwqbvhbd:Mapalengke2024!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" -f fix_vendor_profiles_schema.sql
```

### What this fixes:
- ✅ Adds missing `username` column (fixes 406 errors)
- ✅ Adds missing `complete_address` column (fixes 400 errors)  
- ✅ Adds missing `middle_name`, `business_name`, `business_type` columns
- ✅ Adds missing `vendor_application_id` foreign key column
- ✅ Creates proper indexes
- ✅ Shows current table structure for verification

### After running the script:
- The credential setup should work properly
- No more 406/400 database errors
- Username generation will work correctly
- Vendor profile creation will succeed

**Please run this script now and then test the credential setup again!**

