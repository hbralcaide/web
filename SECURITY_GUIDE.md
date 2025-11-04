# 🔒 Security Configuration Guide

## ✅ What We Fixed

Your sensitive secrets are now **properly protected**! Here's what changed:

### Before (❌ INSECURE):

```env
VITE_SUPABASE_SERVICE_ROLE_KEY=... ← Exposed to browser!
VITE_MAPPEDIN_SECRET=... ← Exposed to browser!
```

### After (✅ SECURE):

```env
# Server-only (NOT exposed to browser)
SUPABASE_SERVICE_ROLE_KEY=... ← Safe! Only in Supabase Functions
MAPPEDIN_SECRET=... ← Safe! Only in Supabase Functions
```

---

## 📋 Environment Variables for Vercel

Add these to **Vercel Dashboard → Settings → Environment Variables**:

### **PUBLIC Variables (Safe to Expose)**

Select: **Production, Preview, Development**

```
VITE_SUPABASE_URL = https://udxoepcssfhljwqbvhbd.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeG9lcGNzc2ZobGp3cWJ2aGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzQyNTksImV4cCI6MjA2OTM1MDI1OX0.CCpVQSyzuDs6sIEEZ42phS7ISKiM-rFfojv1YECpgM0
VITE_SUPABASE_FUNCTIONS_URL = https://udxoepcssfhljwqbvhbd.supabase.co/functions/v1
VITE_MAPPEDIN_SKIP_MAPDATA = true
VITE_MAPPEDIN_API_KEY = mik_M8uMQcxJZDWRbwmrR542e07af
VITE_MAPPEDIN_MAP_ID = 68ee9141b47af0000bc138c1
VITE_MAPPEDIN_MVF_URL = /mappedin/market.mvf.zip
```

### **PRIVATE Variables (Server-Only - No VITE\_ prefix!)**

Select: **Production, Preview, Development**

```
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeG9lcGNzc2ZobGp3cWJ2aGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc3NDI1OSwiZXhwIjoyMDY5MzUwMjU5fQ.SXor8-fBD9cg5H2VnywZYMxzQ5kJyeELxJ2Ydvs_n24
MAPPEDIN_SECRET = mis_4sDELo8xqkrXxLMPEUXzDQsf71J3bvI1UhbUVcWm3WW8dfa102e
```

---

## 🔐 Supabase Edge Functions Configuration

Your Supabase Edge Functions also need these secrets set:

```bash
# In your terminal (when deploying Supabase functions):
supabase secrets set MAPPEDIN_CLIENT_ID="mik_M8uMQcxJZDWRbwmrR542e07af"
supabase secrets set MAPPEDIN_SECRET="mis_4sDELo8xqkrXxLMPEUXzDQsf71J3bvI1UhbUVcWm3WW8dfa102e"
supabase secrets set MAPPEDIN_MAP_ID="68ee9141b47af0000bc138c1"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeG9lcGNzc2ZobGp3cWJ2aGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc3NDI1OSwiZXhwIjoyMDY5MzUwMjU5fQ.SXor8-fBD9cg5H2VnywZYMxzQ5kJyeELxJ2Ydvs_n24"
```

---

## 🎯 How It Works Now

### Client-Side (Browser)

✅ Can access: `VITE_*` variables only
❌ Cannot access: `SUPABASE_SERVICE_ROLE_KEY`, `MAPPEDIN_SECRET`

### Server-Side (Supabase Edge Functions)

✅ Can access: All variables (both `VITE_*` and non-VITE)
✅ Secrets stay on the server, never exposed to browser

### Example Flow:

1. **Browser** uses `VITE_MAPPEDIN_API_KEY` (public, safe)
2. **Browser** calls Supabase Edge Function for secure operations
3. **Edge Function** uses `MAPPEDIN_SECRET` (private, server-only)
4. **Edge Function** returns safe data to browser

---

## 🚨 Security Best Practices

### ✅ DO:

- Use `VITE_` prefix for **public** values (URLs, public API keys, IDs)
- Use **no prefix** for **sensitive** values (service keys, secrets, passwords)
- Store secrets in Vercel Environment Variables Dashboard
- Never commit `.env` file to Git (already in `.gitignore`)

### ❌ DON'T:

- Use `VITE_` prefix for service role keys or secrets
- Hardcode sensitive values in your code
- Share your `.env` file publicly
- Commit sensitive credentials to GitHub

---

## ✅ Verification Checklist

After adding variables to Vercel:

- [ ] All `VITE_*` variables added
- [ ] Both server-only variables added (no `VITE_` prefix)
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Clicked "Save" for each variable
- [ ] Triggered a new deployment (or click "Redeploy")
- [ ] Verified website loads without errors

---

## 🆘 Troubleshooting

**Warning about VITE\_ exposing keys?**

- This is **expected** for public variables
- It's **safe** for: URL, ANON_KEY, API_KEY, MAP_ID
- Just click through the warning

**Website not working after deployment?**

- Check Vercel logs for missing environment variables
- Make sure all variables are added
- Verify you clicked "Redeploy" after adding variables

**Edge Functions failing?**

- Set Supabase secrets using `supabase secrets set`
- Check function logs in Supabase Dashboard

---

## 📖 Further Reading

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Edge Functions Secrets](https://supabase.com/docs/guides/functions/secrets)
