import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('PROJECT_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('ANON_KEY') ?? ''
    
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the requesting user is an admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized: Invalid user')
    }

    // Check if user is an admin
    const { data: adminProfile, error: adminError } = await supabaseClient
      .from('admin_profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (adminError || !adminProfile || adminProfile.status !== 'active') {
      throw new Error('Unauthorized: User is not an active admin')
    }

    // Get the request body
    const { email, firstName, lastName } = await req.json()

    if (!email || !firstName || !lastName) {
      throw new Error('Missing required fields: email, firstName, lastName')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseClient
      .from('admin_profiles')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      throw new Error('An admin with this email already exists')
    }

    // Create admin client with service role key for admin operations
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Invite the user
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'admin',
        },
        redirectTo: `${Deno.env.get('PUBLIC_SITE_URL') ?? Deno.env.get('SITE_URL') ?? 'http://localhost:5173'}/signup`,
      }
    )

    if (inviteError) {
      console.error('Invite error:', inviteError)
      throw new Error(`Failed to invite user: ${inviteError.message}`)
    }

    // Create admin profile
    const { error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .insert({
        id: inviteData.user.id,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        role: 'admin',
        status: 'active',
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // If profile creation fails, we should delete the invited user
      await supabaseAdmin.auth.admin.deleteUser(inviteData.user.id)
      throw new Error(`Failed to create admin profile: ${profileError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin invited successfully',
        admin: {
          id: inviteData.user.id,
          email: email.toLowerCase(),
          firstName,
          lastName,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in invite-admin function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
