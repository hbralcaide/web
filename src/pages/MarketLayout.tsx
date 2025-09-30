import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function MarketLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link 
                to="/admin/market/map" 
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600"
              >
                Indoor Map
              </Link>
              <Link 
                to="/admin/market/sections" 
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600"
              >
                Sections
              </Link>
              <Link 
                to="/admin/market/stalls" 
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600"
              >
                Stalls
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}