import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Function to generate username and check availability
const generateUsername = async (firstName: string, lastName: string): Promise<string> => {
  // Base username: first letter of firstname + lastname (all lowercase)
  const baseUsername = (firstName.charAt(0) + lastName).toLowerCase()
  
  // Check if base username exists
  const { data: existingUsers } = await supabase
    .from('admin_profiles')
    .select('username')
    .ilike('username', `${baseUsername}%`)
    .order('username', { ascending: true })

  if (!existingUsers?.length) {
    return baseUsername
  }

  // Find the highest number suffix
  const usernames = (existingUsers as { username: string }[]).map(u => u.username)
  let highestSuffix = 0

  usernames.forEach(username => {
    if (username === baseUsername) {
      highestSuffix = Math.max(highestSuffix, 1)
    } else {
      const suffix = parseInt(username.replace(baseUsername, '')) || 0
      highestSuffix = Math.max(highestSuffix, suffix)
    }
  })

  return `${baseUsername}${highestSuffix + 1}`
}

const Signup = () => {
  const navigate = useNavigate()
  const [emailValue, setEmailValue] = useState('')
  const [isVerifying, setIsVerifying] = useState(true)
  const [session, setSession] = useState<any>(null)
  
  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (currentSession?.user?.email) {
          setEmailValue(currentSession.user.email)
          setSession(currentSession)
        } else {
          throw new Error('No valid session found')
        }
        setIsVerifying(false)
      } catch (error) {
        console.error('Error verifying invitation:', error)
        setIsVerifying(false)
        setError('Invalid or expired invitation. Please use the link from your email.')
      }
    }

    verifyInvitation()
  }, [])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate form data
    if (!emailValue) {
      setError('No email provided in invitation link')
      setLoading(false)
      return
    }

    if (!session) {
      setError('Invalid or expired session. Please use the link from your email.')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      // Generate username
      const username = await generateUsername(formData.firstName, formData.lastName)

      // Update the user's password and metadata
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          username: username
        }
      })

      if (updateError) throw updateError

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      // Create admin profile
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .insert([{
          auth_user_id: user.id,
          username: username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: emailValue,
          phone_number: formData.phoneNumber,
          role: 'admin',
          status: 'Active'
        }] as any)

      if (profileError) throw profileError

      navigate('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Verifying invitation...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-red-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex overflow-hidden">
        {/* Left Panel: Signup Form */}
        <div className="w-2/3 p-6 flex flex-col justify-center bg-white bg-opacity-90 transition-all duration-300 ease-in-out">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">Sign Up</h2>
          <form className="space-y-4 animate-fade-in" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-base font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                value={formData.firstName}
                onChange={e => setFormData(prev => ({...prev, firstName: e.target.value}))}
              />
            </div>
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-base font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                value={formData.lastName}
                onChange={e => setFormData(prev => ({...prev, lastName: e.target.value}))}
              />
            </div>
            {/* Username Preview */}
            <div>
              <label htmlFor="username" className="block text-base font-semibold text-gray-700 mb-2">Username (auto-generated)</label>
              <div className="block w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-base">
                <span className="text-gray-900 font-semibold">
                  {formData.firstName && formData.lastName ? `${formData.firstName.charAt(0).toLowerCase()}${formData.lastName.toLowerCase()}` : 'Please enter your name'}
                </span>
              </div>
            </div>
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-base font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="flex items-center mt-1">
                <span className="inline-block px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700 font-semibold text-base">+63</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={13}
                  value={formData.phoneNumber}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    let formatted = digits;
                    if (digits.length > 3) {
                      formatted = digits.slice(0, 3) + ' ' + digits.slice(3);
                    }
                    if (digits.length > 6) {
                      formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
                    }
                    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
                  }}
                  className="block w-full rounded-r-lg border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-900 font-semibold transition-all duration-200"
                  placeholder="xxx xxx xxxx"
                  required
                />
              </div>
            </div>
            {/* Email (readonly) */}
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">Email</label>
              <div className="block w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-base">
                <span className="text-gray-900 font-semibold">
                  {emailValue || 'No email found. Please use the invitation link from your email.'}
                </span>
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                value={formData.password}
                onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
              />
            </div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                value={formData.confirmPassword}
                onChange={e => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
              />
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center animate-pulse">{error}</div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-3 rounded-lg shadow-lg text-base font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 mt-4 transition-all duration-200"
            >
              {loading ? 'Creating account...' : 'Complete Setup'}
            </button>
          </form>
        </div>
        {/* Right Panel: Welcome Message */}
        <div className="w-1/3 flex flex-col items-center justify-center bg-gradient-to-tr from-pink-500 to-red-500 text-white p-6 animate-slide-in-right">
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Hello, Friend!</h2>
          <p className="mb-6 text-base text-center">Enter your personal details and start your journey with us.</p>
        </div>
      </div>
    </div>
  )
}

export default Signup