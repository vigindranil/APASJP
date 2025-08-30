"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Calendar, TrendingUp, LogOut, Eye, BarChart3, Activity } from "lucide-react"

interface DashboardStats {
  totalUserQueries: number
  totalExperiences: number
  todayQueries: number
  todayExperiences: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUserQueries: 0,
    totalExperiences: 0,
    todayQueries: 0,
    todayExperiences: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin/login")
      return
    }

    // Fetch dashboard statistics
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const navigateToDetails = (type: "queries" | "experiences") => {
    router.push(`/admin/${type}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-ping"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with Glass Effect */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500">Management Console</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-4">
            Analytics Overview
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Monitor user engagement, track queries, and analyze experiences with real-time insights
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card
            className="group cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            onClick={() => navigateToDetails("queries")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-600">Total User Queries</CardTitle>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-slate-800 mb-2">{stats.totalUserQueries.toLocaleString()}</div>
              <p className="text-xs text-slate-500 flex items-center">
                <Eye className="inline w-3 h-3 mr-1.5" />
                Click to explore details
              </p>
            </CardContent>
          </Card>

          <Card
            className="group cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            onClick={() => navigateToDetails("experiences")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-600">Total Experiences</CardTitle>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-slate-800 mb-2">{stats.totalExperiences.toLocaleString()}</div>
              <p className="text-xs text-slate-500 flex items-center">
                <Eye className="inline w-3 h-3 mr-1.5" />
                Click to explore details
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-600">Today's Queries</CardTitle>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 rounded-lg shadow-md">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-slate-800 mb-2">{stats.todayQueries.toLocaleString()}</div>
              <p className="text-xs text-slate-500 flex items-center">
                <Activity className="inline w-3 h-3 mr-1.5" />
                Active today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 group-hover:from-rose-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-600">Today's Experiences</CardTitle>
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2.5 rounded-lg shadow-md">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-slate-800 mb-2">{stats.todayExperiences.toLocaleString()}</div>
              <p className="text-xs text-slate-500 flex items-center">
                <Activity className="inline w-3 h-3 mr-1.5" />
                Shared today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">User Queries</CardTitle>
                    <CardDescription className="text-slate-600">Comprehensive query management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Access detailed analytics, search functionality, and comprehensive management tools for all user camp queries.
                </p>
                <Button 
                  onClick={() => navigateToDetails("queries")} 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium py-3"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Explore Queries
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">User Experiences</CardTitle>
                    <CardDescription className="text-slate-600">Experience insights & feedback</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Review, analyze, and manage shared user experiences with advanced filtering and export capabilities.
                </p>
                <Button 
                  onClick={() => navigateToDetails("experiences")} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium py-3"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Analyze Experiences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">System Online</span>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}