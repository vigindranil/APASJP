"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, Calendar, MapPin, User, Phone, Database, Download, RefreshCw } from "lucide-react"

interface UserQuery {
  id: number
  name: string
  phone: string
  block_name: string
  ward_name: string
  booth_name: string
  language: string
  created_at: string
  camp_date: string
  venue: string
  habitation: string
  ac: string
}

interface FilterState {
  blockName: string
  wardName: string
  dateFrom: string
  dateTo: string
  language: string
}

export default function UserQueriesPage() {
  const [queries, setQueries] = useState<UserQuery[]>([])
  const [filteredQueries, setFilteredQueries] = useState<UserQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    blockName: "all",
    wardName: "all",
    dateFrom: "",
    dateTo: "",
    language: "all",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin/login")
      return
    }

    fetchQueries()
  }, [router])

  useEffect(() => {
    applyFilters()
  }, [queries, filters, searchTerm])

  const fetchQueries = async () => {
    try {
      const response = await fetch("/api/admin/queries")
      if (response.ok) {
        const data = await response.json()
        setQueries(data)
      }
    } catch (error) {
      console.error("Error fetching queries:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = queries

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (query) =>
          query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.phone.includes(searchTerm) ||
          query.block_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.ward_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply block filter
    if (filters.blockName !== "all") {
      filtered = filtered.filter((query) => query.block_name === filters.blockName)
    }

    // Apply ward filter
    if (filters.wardName !== "all") {
      filtered = filtered.filter((query) => query.ward_name === filters.wardName)
    }

    // Apply language filter
    if (filters.language !== "all") {
      filtered = filtered.filter((query) => query.language === filters.language)
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((query) => new Date(query.created_at) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filtered = filtered.filter((query) => new Date(query.created_at) <= new Date(filters.dateTo))
    }

    setFilteredQueries(filtered)
  }

  const resetFilters = () => {
    setFilters({
      blockName: "all",
      wardName: "all",
      dateFrom: "",
      dateTo: "",
      language: "all",
    })
    setSearchTerm("")
  }

  const getLanguageBadgeColor = (language: string) => {
    switch (language) {
      case "en":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300"
      case "bn":
        return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300"
      case "np":
        return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300"
    }
  }

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case "en":
        return "English"
      case "bn":
        return "Bengali"
      case "np":
        return "Nepali"
      default:
        return language
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-ping"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading queries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with Glass Effect */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/admin/dashboard")} 
                className="hover:bg-white/60 transition-all duration-200 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    User Queries
                  </h1>
                  <p className="text-sm text-slate-500">Query Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="border-slate-200 hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                onClick={fetchQueries}
                className="border-slate-200 hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Queries</p>
                  <p className="text-3xl font-bold text-slate-800">{queries.length.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Filtered Results</p>
                  <p className="text-3xl font-bold text-slate-800">{filteredQueries.length.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Unique Languages</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {Array.from(new Set(queries.map(q => q.language))).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-t-lg">
            <CardTitle className="flex items-center text-slate-800">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-2 rounded-lg mr-3 shadow-md">
                <Filter className="w-5 h-5 text-white" />
              </div>
              Advanced Filters
            </CardTitle>
            <CardDescription className="text-slate-600">
              Use filters to find specific queries and analyze patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                />
              </div>

              <Select
                value={filters.blockName}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, blockName: value }))}
              >
                <SelectTrigger className="bg-white/80 border-slate-200 hover:border-slate-300 transition-colors">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="all">All Blocks</SelectItem>
                  {Array.from(new Set(queries.map((q) => q.block_name))).map((block) => (
                    <SelectItem key={block} value={block}>
                      {block}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.wardName}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, wardName: value }))}
              >
                <SelectTrigger className="bg-white/80 border-slate-200 hover:border-slate-300 transition-colors">
                  <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="all">All Wards</SelectItem>
                  {Array.from(new Set(queries.map((q) => q.ward_name))).map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.language}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, language: value }))}
              >
                <SelectTrigger className="bg-white/80 border-slate-200 hover:border-slate-300 transition-colors">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="np">Nepali</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
              />

              <Input
                type="date"
                placeholder="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                  <p className="text-sm font-medium text-slate-700">
                    <span className="text-blue-600 font-bold">{filteredQueries.length.toLocaleString()}</span> of{" "}
                    <span className="text-slate-600">{queries.length.toLocaleString()}</span> queries
                  </p>
                </div>
                {(searchTerm || filters.blockName !== "all" || filters.wardName !== "all" || filters.language !== "all" || filters.dateFrom || filters.dateTo) && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                    Filters Active
                  </Badge>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="border-slate-200 hover:bg-white/80 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Queries List */}
        <div className="space-y-6">
          {filteredQueries.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="text-center py-16">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No queries found</h3>
                <p className="text-slate-500">Try adjusting your search criteria or filters to find relevant queries.</p>
              </CardContent>
            </Card>
          ) : (
            filteredQueries.map((query, index) => (
              <Card 
                key={query.id} 
                className="group bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/3 group-hover:from-blue-500/8 group-hover:to-purple-500/8 transition-all duration-300"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                        #{query.id}
                      </div>
                      <Badge className={`${getLanguageBadgeColor(query.language)} shadow-sm font-medium`}>
                        {getLanguageLabel(query.language)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Query Date</p>
                      <p className="font-semibold text-slate-700">{new Date(query.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Information */}
                    <div className="space-y-5">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-2 rounded-lg shadow-sm">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">User Information</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-1">
                            <User className="w-4 h-4 mr-3 text-blue-500" />
                            <span className="font-semibold text-slate-600">Full Name</span>
                          </div>
                          <p className="text-slate-800 font-medium ml-7">{query.name || "Not provided"}</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-1">
                            <Phone className="w-4 h-4 mr-3 text-emerald-500" />
                            <span className="font-semibold text-slate-600">Phone Number</span>
                          </div>
                          <p className="text-slate-800 font-medium ml-7">{query.phone || "Not provided"}</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-3 text-rose-500" />
                            <span className="font-semibold text-slate-600">Location Hierarchy</span>
                          </div>
                          <div className="ml-7 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Block
                              </Badge>
                              <span className="text-slate-700 font-medium">{query.block_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                Ward
                              </Badge>
                              <span className="text-slate-700 font-medium">{query.ward_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                Booth
                              </Badge>
                              <span className="text-slate-700 font-medium">{query.booth_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Camp Information */}
                    <div className="space-y-5">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg shadow-sm">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">Camp Details Requested</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-1">
                            <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                            <span className="font-semibold text-slate-600">Camp Date</span>
                          </div>
                          <p className="text-slate-800 font-medium ml-7">
                            {query.camp_date ? new Date(query.camp_date).toLocaleDateString() : "Not available"}
                          </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-1">
                            <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                            <span className="font-semibold text-slate-600">Venue</span>
                          </div>
                          <p className="text-slate-800 font-medium ml-7">{query.venue || "Not available"}</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-1">
                            <MapPin className="w-4 h-4 mr-3 text-teal-500" />
                            <span className="font-semibold text-slate-600">Habitation</span>
                          </div>
                          <p className="text-slate-800 font-medium ml-7">{query.habitation || "Not available"}</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
                          <div className="flex items-center text-sm mb-1">
                            <Database className="w-4 h-4 mr-3 text-violet-500" />
                            <span className="font-semibold text-slate-600">Assembly Constituency</span>
                          </div>
                          <p className="text-slate-800 font-medium ml-7">{query.ac || "Not available"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Query Timestamp */}
                  <div className="mt-6 pt-6 border-t border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted on {new Date(query.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-500 font-medium">Processed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/4 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}