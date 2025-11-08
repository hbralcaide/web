import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Helper function to convert 12-hour time to 24-hour for comparison
const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  
  if (hours === '12') {
    hours = modifier === 'AM' ? '00' : '12'
  } else if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12)
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`
}

interface DashboardStats {
  pendingApplications: number
  activeVendors: number
  inactiveVendors: number
  totalVendors: number
  availableStalls: number
  occupiedStalls: number
  maintenanceStalls: number
  totalStalls: number
  totalSections: number
  avgOccupancyRate: number
  openVendors: number
  closedVendors: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingApplications: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    totalVendors: 0,
    availableStalls: 0,
    occupiedStalls: 0,
    maintenanceStalls: 0,
    totalStalls: 0,
    totalSections: 0,
    avgOccupancyRate: 0,
    openVendors: 0,
    closedVendors: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchDashboardStats()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000)
    
    // Set up real-time subscriptions for live updates
    const applicationsChannel = supabase
      .channel('dashboard-applications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vendor_applications' },
        () => {
          console.log('Vendor application changed, refreshing stats...')
          fetchDashboardStats()
        }
      )
      .subscribe()

    const vendorsChannel = supabase
      .channel('dashboard-vendors')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vendor_profiles' },
        () => {
          console.log('Vendor profile changed, refreshing stats...')
          fetchDashboardStats()
        }
      )
      .subscribe()

    const stallsChannel = supabase
      .channel('dashboard-stalls')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'stalls' },
        () => {
          console.log('Stall changed, refreshing stats...')
          fetchDashboardStats()
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(applicationsChannel)
      supabase.removeChannel(vendorsChannel)
      supabase.removeChannel(stallsChannel)
    }
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Fetch vendor applications (pending)
      const { count: pendingCount } = await supabase
        .from('vendor_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Fetch vendor profiles by status and operating hours
      const { data: vendors } = await supabase
        .from('vendor_profiles')
        .select('status, operating_hours')

      console.log('Fetched vendors:', vendors) // Debug log

      const totalVendorCount = vendors?.length || 0
      
      // More flexible status matching - matches 'Active', 'active', 'ACTIVE', etc.
      const activeCount = vendors?.filter((v: any) => 
        v.status && v.status.toLowerCase().includes('active')
      ).length || 0
      const inactiveCount = vendors?.filter((v: any) => 
        v.status && v.status.toLowerCase().includes('inactive')
      ).length || 0
      
      // Determine open/closed status based on operating_hours and current time
      const now = new Date()
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      
      console.log('Current day:', currentDay, 'Current time:', currentTime)
      
      const openCount = vendors?.filter((v: any) => {
        // Only count active vendors
        if (!v.status?.toLowerCase().includes('active')) return false
        
        // Must have operating_hours set to be counted
        if (!v.operating_hours) return false
        
        // Parse operating_hours if it's a string
        let hours = v.operating_hours
        if (typeof hours === 'string') {
          try {
            hours = JSON.parse(hours)
          } catch (e) {
            return false // Invalid JSON
          }
        }
        
        if (typeof hours !== 'object') return false
        
        const todaySchedule = hours[currentDay]
        if (!todaySchedule) return false // No schedule for today
        
        // Check if open today
        return todaySchedule.open === true
      }).length || 0
      
      const closedCount = vendors?.filter((v: any) => {
        // Only count active vendors
        if (!v.status?.toLowerCase().includes('active')) return false
        
        // Must have operating_hours set to be counted
        if (!v.operating_hours) return false
        
        // Parse operating_hours if it's a string
        let hours = v.operating_hours
        if (typeof hours === 'string') {
          try {
            hours = JSON.parse(hours)
          } catch (e) {
            return false // Invalid JSON
          }
        }
        
        if (typeof hours !== 'object') return false
        
        const todaySchedule = hours[currentDay]
        if (!todaySchedule) return false // No schedule for today
        
        // Check if closed today
        return todaySchedule.open === false
      }).length || 0

      const vendorsWithoutHours = vendors?.filter((v: any) => 
        v.status?.toLowerCase().includes('active') && !v.operating_hours
      ).length || 0

      console.log('Vendor counts:', { 
        totalVendorCount, 
        activeCount, 
        inactiveCount, 
        openCount, 
        closedCount,
        vendorsWithoutHours,
        currentDay 
      }) // Debug log

      // Fetch stalls by status
      const { data: stalls } = await supabase
        .from('stalls')
        .select('status')

      const totalStallsCount = stalls?.length || 0
      const availableCount = stalls?.filter((s: any) => s.status === 'vacant' || s.status === 'available').length || 0
      const occupiedCount = stalls?.filter((s: any) => s.status === 'occupied').length || 0
      const maintenanceCount = stalls?.filter((s: any) => s.status === 'maintenance').length || 0

      // Fetch market sections
      const { count: sectionsCount } = await supabase
        .from('market_sections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Calculate occupancy rate
      const occupancyRate = totalStallsCount > 0 ? (occupiedCount / totalStallsCount) * 100 : 0

      setStats({
        pendingApplications: pendingCount || 0,
        activeVendors: activeCount,
        inactiveVendors: inactiveCount,
        totalVendors: totalVendorCount,
        availableStalls: availableCount,
        occupiedStalls: occupiedCount,
        maintenanceStalls: maintenanceCount,
        totalStalls: totalStallsCount,
        totalSections: sectionsCount || 0,
        avgOccupancyRate: Math.round(occupancyRate),
        openVendors: openCount,
        closedVendors: closedCount
      })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Last updated: {formatTime(lastUpdated)}
          </div>
          <button 
            onClick={fetchDashboardStats}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 flex items-center">
        <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
        <span>Real-time updates enabled • Dashboard refreshes automatically every 30 seconds</span>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-blue-900">Pending Applications</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pendingApplications}</p>
              <p className="text-sm text-blue-700 mt-1">Awaiting review</p>
            </div>
            <div className="text-4xl text-blue-300">📋</div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-green-900">Active Vendors</h2>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeVendors}</p>
              <p className="text-sm text-green-700 mt-1">
                {stats.inactiveVendors} inactive • {stats.totalVendors} total
              </p>
            </div>
            <div className="text-4xl text-green-300">👥</div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-yellow-900">Available Stalls</h2>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.availableStalls}</p>
              <p className="text-sm text-yellow-700 mt-1">
                {stats.occupiedStalls} occupied • {stats.totalStalls} total
              </p>
            </div>
            <div className="text-4xl text-yellow-300">🏪</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Occupied Stalls</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.occupiedStalls}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            Currently in use
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Under Maintenance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.maintenanceStalls}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            Temporarily unavailable
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Market Sections</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSections}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mr-1"></span>
            Active sections
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Occupancy Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgOccupancyRate}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${stats.avgOccupancyRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Real-Time Vendor Operational Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></span>
          Vendor Operational Status (Today: {new Date().toLocaleDateString('en-US', { weekday: 'long' })})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Open Today</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{stats.openVendors}</p>
                <p className="text-xs text-green-600 mt-1">Scheduled to operate today</p>
              </div>
              <div className="text-4xl">🟢</div>
            </div>
          </div>
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Closed Today</p>
                <p className="text-3xl font-bold text-gray-700 mt-1">{stats.closedVendors}</p>
                <p className="text-xs text-gray-600 mt-1">Not operating today</p>
              </div>
              <div className="text-4xl">⚫</div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500 italic">
          * Based on vendor operating hours schedule. Vendors can update their weekly schedule via mobile app.
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="/admin/vendors" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 text-center transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👥</div>
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Manage Vendors</div>
            <div className="text-xs text-gray-500 mt-1">{stats.totalVendors} total</div>
          </a>
          
          <a 
            href="/admin/stalls" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 text-center transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏪</div>
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Manage Stalls</div>
            <div className="text-xs text-gray-500 mt-1">{stats.totalStalls} total</div>
          </a>
          
          <a 
            href="/admin/market/sections" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 text-center transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🗺️</div>
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Market Sections</div>
            <div className="text-xs text-gray-500 mt-1">{stats.totalSections} sections</div>
          </a>
          
          <a 
            href="/admin/raffle" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 text-center transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎲</div>
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Run Raffle</div>
            <div className="text-xs text-gray-500 mt-1">Stall assignment</div>
          </a>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-3 w-3 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-700">Database Connection</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-gray-700">Real-time Sync</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-3 w-3 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-700">Map Service</p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
