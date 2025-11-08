# Quick Start: Deploy Admin Invite Function

Follow these steps to enable the "Invite Admin" feature in your application.

## Step 1: Install Supabase CLI

Open PowerShell and run:

```powershell
npm install -g supabase
```

Wait for installation to complete.

## Step 2: Link Your Project

From your project directory (`c:\Users\Hannah\Desktop\web`), run:

```powershell
supabase link --project-ref YOUR_PROJECT_ID
```

**To find your Project ID:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Project Settings" (gear icon) in the sidebar
4. Look for "Reference ID" under "General settings"

You'll be prompted for an Access Token. To get it:
1. Click your profile icon (top right in Supabase Dashboard)
2. Go to "Access Tokens"
3. Click "Generate new token"
4. Give it a name like "CLI Access"
5. Copy the token and paste it in PowerShell

## Step 3: Deploy the Function

Run this command:

```powershell
supabase functions deploy invite-admin
```

You should see output like:
```
Deploying invite-admin (project ref: ...)
Deployed Function invite-admin with image version: ...
```

## Step 4: Set Environment Variables

Run these commands ONE BY ONE, replacing the values:

```powershell
supabase secrets set SUPABASE_URL=https://your-project.supabase.co

supabase secrets set SUPABASE_ANON_KEY=your-anon-key-here

supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

supabase secrets set PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**To find these values:**
1. Go to Supabase Dashboard → Project Settings → API
2. **SUPABASE_URL**: Copy "Project URL"
3. **SUPABASE_ANON_KEY**: Copy the `anon` `public` key
4. **SUPABASE_SERVICE_ROLE_KEY**: Copy the `service_role` `secret` key
5. **PUBLIC_SITE_URL**: Your app's URL (if testing locally, use `http://localhost:5173`)

## Step 5: Test the Function

1. Open your app and log in as admin
2. Go to the "Admins" page
3. Click "Invite New Admin"
4. Fill in the form:
   - Email: test@example.com
   - First Name: Test
   - Last Name: Admin
5. Click "Send Invitation"

If successful, you'll see "Invitation sent successfully!" and the new admin will appear in the list.

## Troubleshooting

### Error: "Failed to invite admin"

**Check function logs:**
```powershell
supabase functions logs invite-admin --follow
```

Leave this running in PowerShell and try inviting an admin again. You'll see detailed error messages.

### Error: "Network request failed"

1. Make sure your app is running (`npm run dev`)
2. Check that VITE_SUPABASE_URL in your `.env` file matches your project URL
3. Clear browser cache and reload

### Error: "Unauthorized"

1. Make sure you're logged in as an admin
2. Check that your admin profile in the database has `status = 'active'`
3. Try logging out and logging back in

### Function deployed but not working

Verify the secrets are set:
```powershell
supabase secrets list
```

You should see all four variables listed.

## Success Checklist

- [x] Supabase CLI installed
- [x] Project linked
- [x] Function deployed
- [x] All secrets set
- [x] Successfully invited a test admin
- [x] Invitation email received
- [x] Test admin can sign up

## What Happens When You Invite

1. You fill in the admin's email and name
2. The Edge Function creates a new user in Supabase Auth
3. An admin profile is created in the `admin_profiles` table
4. Supabase sends an invitation email to the admin
5. The admin clicks the link in the email
6. They're taken to your signup page to set their password
7. After signing up, they can log in to the admin panel

## Need Help?

If you encounter issues:

1. Check the function logs: `supabase functions logs invite-admin`
2. Verify your environment variables are correct
3. Make sure the `admin_profiles` table exists with proper RLS policies
4. Check that the Supabase Auth email templates are configured

## Alternative: Manual Method

If you can't deploy the Edge Function right now, you can still invite admins manually:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite User"
3. Enter the email address
4. The user receives an email and completes signup
5. Manually add them to `admin_profiles` table via SQL:

```sql
INSERT INTO admin_profiles (id, email, first_name, last_name, role, status)
VALUES (
  'user-id-from-auth-users-table',
  'admin@example.com',
  'First',
  'Last',
  'admin',
  'active'
);
```
