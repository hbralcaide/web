# Edge Function Deployment Guide

This guide explains how to deploy the `invite-admin` Edge Function to enable admin invitation functionality in your app.

## Prerequisites

1. **Supabase CLI installed**
   ```bash
   npm install -g supabase
   ```

2. **Supabase Project Access**
   - You need your Project ID
   - You need an Access Token

## Step 1: Link Your Project

Run this command in your terminal from the project root (`c:\Users\Hannah\Desktop\web`):

```bash
supabase link --project-ref your-project-id
```

You'll be prompted to enter your access token. Get it from:
- Go to Supabase Dashboard
- Click your profile icon (top right)
- Settings → Access Tokens
- Create a new token if needed

## Step 2: Deploy the Function

```bash
supabase functions deploy invite-admin
```

This will upload the function from `supabase/functions/invite-admin/index.ts` to your Supabase project.

## Step 3: Set Environment Variables

The function needs environment variables to work. Set them using:

```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set PUBLIC_SITE_URL=https://your-domain.com
```

**Where to find these values:**
- Go to Supabase Dashboard → Project Settings → API
- `SUPABASE_URL`: Project URL
- `SUPABASE_ANON_KEY`: `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY`: `service_role` `secret` key (⚠️ Keep this secret!)
- `PUBLIC_SITE_URL`: Your app's URL (use `http://localhost:5173` for local development)

## Step 4: Update the Frontend

The `AdminManagement.tsx` file has already been updated to use the Edge Function. The function will be called at:

```
https://your-project.supabase.co/functions/v1/invite-admin
```

The URL is automatically constructed using your Supabase project URL.

## Testing the Function

After deployment, test it by:

1. Go to your admin page: `/admin/admins`
2. Click "Invite New Admin"
3. Fill in the email, first name, and last name
4. Click "Send Invitation"

If successful, you should see a success message and the new admin will appear in the list.

## Troubleshooting

### Error: "Failed to invite admin"

**Check:**
1. Edge function is deployed: `supabase functions list`
2. Environment variables are set: `supabase secrets list`
3. Service role key is correct
4. Check function logs: `supabase functions logs invite-admin`

### Error: "Network request failed"

**Check:**
1. Your Supabase URL in `src/config/supabaseClient.ts` is correct
2. CORS is configured (the function includes CORS headers)
3. Check browser console for detailed error

### Error: "Unauthorized"

**Check:**
1. You're logged in as an admin
2. Your admin status is "active" in the `admin_profiles` table
3. The authorization header is being sent

## Viewing Function Logs

To see what's happening in your function:

```bash
supabase functions logs invite-admin --follow
```

This will show real-time logs when the function is called.

## Alternative: Manual Admin Creation

If you can't deploy the Edge Function right now, admins can still be created manually:

1. **Via Supabase Dashboard:**
   - Go to Authentication → Users
   - Click "Invite User"
   - Enter the email address
   - User receives email and completes signup

2. **Via SQL:**
   ```sql
   -- First, create the auth user (requires service role access)
   -- Then create the profile:
   INSERT INTO admin_profiles (id, email, first_name, last_name, role, status)
   VALUES (
     'user-uuid-from-auth-users',
     'admin@example.com',
     'First',
     'Last',
     'admin',
     'active'
   );
   ```

## Security Notes

- The Edge Function validates that only active admins can invite new admins
- The service role key is kept secure on the server side
- All requests are authenticated using the user's JWT token
- Email addresses are validated before invitation
- Duplicate emails are prevented

## Next Steps

After deploying, you may want to:

1. Test the invite flow end-to-end
2. Customize the invitation email template in Supabase Dashboard
3. Set up email templates for password resets
4. Configure custom SMTP settings if needed

For more information, see the [Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions).
