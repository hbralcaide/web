# Deployment Scripts

This folder contains scripts to help with deploying and managing your application.

## Admin Invite Function Deployment

### Quick Deploy (Recommended)

Run the automated deployment script:

```powershell
.\scripts\deploy-admin-invite.ps1
```

This script will:

1. Check if Supabase CLI is installed (installs if needed)
2. Link your Supabase project
3. Deploy the `invite-admin` Edge Function
4. Guide you through setting environment variables
5. Confirm successful deployment

### What You'll Need

Before running the script, have these ready:

- **Project ID**: Found in Supabase Dashboard → Project Settings → General → Reference ID
- **Access Token**: Create one in Supabase Dashboard → Your Profile → Access Tokens
- **Supabase URL**: From Project Settings → API → Project URL
- **Anon Key**: From Project Settings → API → `anon` `public` key
- **Service Role Key**: From Project Settings → API → `service_role` `secret` key
- **Site URL**: Your app URL (e.g., `https://your-app.vercel.app` or `http://localhost:5173` for local)

### Manual Deployment

If you prefer to run commands manually, see:

- **QUICK_START_ADMIN_INVITE.md** - Step-by-step guide
- **EDGE_FUNCTION_DEPLOYMENT.md** - Detailed documentation

## Other Scripts

### fetch_mvf.mjs

Fetches Mappedin venue data.

### test_mappedin.js / test_mappedin.mjs

Test scripts for Mappedin integration.

## Troubleshooting

### Script won't run

PowerShell execution policy may be blocking the script. Run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Supabase CLI errors

Make sure Node.js and npm are installed:

```powershell
node --version
npm --version
```

### Function deployment fails

Check that you're in the correct directory (`c:\Users\Hannah\Desktop\web`) and that the `supabase/functions/invite-admin` folder exists.

## Need Help?

- Check **EDGE_FUNCTION_DEPLOYMENT.md** for troubleshooting
- View function logs: `supabase functions logs invite-admin --follow`
- Verify secrets: `supabase secrets list`
