import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Test Supabase connection first
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Testing Supabase connection...')
      
      const { data: testData, error: testError } = await supabase
        .from('admin_profiles')
        .select('count', { count: 'exact', head: true })
      
      console.log('Supabase connection test:', { count: testData, error: testError })
      
      // Add debugging
      console.log('Attempting to find username:', username)
      console.log('Username length:', username.length)
      console.log('Username chars:', username.split('').map(c => c.charCodeAt(0)))
      
      // Try a direct email login first for testing
      if (username === 'test') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'hanclaid@gmail.com',
          password,
        })
        if (!signInError) {
          navigate('/admin', { replace: true })
          return
        }
      }

      // Query admin_profiles table directly (RLS should allow this now)
      const { data: profiles, error: profileError } = await supabase
        .from('admin_profiles')
        .select('email')
        .eq('username', username.trim())
        .eq('status', 'Active')

      console.log('Admin lookup result:', { profiles, profileError })

      if (profileError) {
        console.error('Profile lookup error:', profileError)
        throw new Error('Database error')
      }

      if (!profiles || profiles.length === 0) {
        console.log('No admin found for username:', username)
        throw new Error('Invalid username')
      }

      const adminEmail = (profiles[0] as any).email
      console.log('Found admin email:', adminEmail)

      // Then sign in with the email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid password')
        }
        throw signInError
      }

      navigate('/admin', { replace: true })
    } catch (err: any) {
      console.error('Error logging in:', err)
      setError(err.message === 'Invalid username' ? 'Invalid username' : 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to Mapalengke Admin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}