"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, Calendar, User, Phone, MessageSquare, RefreshCw, Languages, FileText, Clock, TrendingUp } from "lucide-react"

interface UserExperience {
  id: number
  name: string
  phone: string
  experience: string
  language: string
  created_at: string
}

interface FilterState {
  dateFrom: string
  dateTo: string
  language: string
}

export default function UserExperiencesPage() {
  const [experiences, setExperiences] = useState<UserExperience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<UserExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
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

    fetchExperiences()
  }, [router])

  useEffect(() => {
    applyFilters()
  }, [experiences, filters, searchTerm])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/experiences")
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      }
    } catch (error) {
      console.error("Error fetching experiences:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = experiences

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.phone.includes(searchTerm) ||
          exp.experience.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply language filter
    if (filters.language !== "all") {
      filtered = filtered.filter((exp) => exp.language === filters.language)
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((exp) => new Date(exp.created_at) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filtered = filtered.filter((exp) => new Date(exp.created_at) <= new Date(filters.dateTo))
    }

    setFilteredExperiences(filtered)
  }

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      language: "all",
    })
    setSearchTerm("")
  }

  const getLanguageBadgeColor = (language: string) => {
    switch (language) {
      case "en":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "bn":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "np":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Get statistics for the dashboard cards
  const getStatistics = () => {
    const totalExperiences = experiences.length
    const filteredTotal = filteredExperiences.length
    const languages = Array.from(new Set(experiences.map(exp => exp.language))).length
    const avgLength = experiences.length > 0 
      ? Math.round(experiences.reduce((sum, exp) => sum + exp.experience.length, 0) / experiences.length)
      : 0
    
    return { totalExperiences, filteredTotal, languages, avgLength }
  }

  const stats = getStatistics()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin/dashboard")} 
                className="bg-white hover:bg-slate-50 border-slate-300 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">User Experiences Management</h1>
                <p className="text-slate-600 text-sm">View and analyze user feedback and experiences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={fetchExperiences}
                variant="outline"
                disabled={loading}
                className="bg-white hover:bg-slate-50 border-slate-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Experiences</p>
                  <p className="text-2xl font-bold">{stats.totalExperiences.toLocaleString()}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Filtered Results</p>
                  <p className="text-2xl font-bold">{stats.filteredTotal.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Languages</p>
                  <p className="text-2xl font-bold">{stats.languages}</p>
                </div>
                <Languages className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg Length</p>
                  <p className="text-2xl font-bold">{stats.avgLength}</p>
                  <p className="text-orange-200 text-xs">characters</p>
                </div>
                <FileText className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-200">
            <CardTitle className="flex items-center text-slate-800">
              <Filter className="w-5 h-5 mr-3 text-purple-600" />
              Advanced Filters & Search
            </CardTitle>
            <CardDescription className="text-slate-600">
              Search and filter user experiences to find specific feedback and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>

              <Select
                value={filters.language}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, language: value }))}
              >
                <SelectTrigger className="bg-white border-slate-300 focus:border-purple-500">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="np">Nepali</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  placeholder="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="pl-10 bg-white border-slate-300 focus:border-purple-500"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  placeholder="To Date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="pl-10 bg-white border-slate-300 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-slate-700">
                  Showing <span className="font-bold text-purple-600">{filteredExperiences.length}</span> of{" "}
                  <span className="font-bold">{experiences.length}</span> experiences
                </p>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                    <Search className="w-3 h-3 mr-1" />
                    "{searchTerm}"
                  </Badge>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Experiences List */}
        <div className="space-y-6">
          {filteredExperiences.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
              <CardContent className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-medium">No experiences found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredExperiences.map((experience) => (
              <Card 
                key={experience.id} 
                className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80"
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-slate-900">
                            Experience #{experience.id}
                          </h3>
                          <p className="text-slate-500 text-sm">User feedback and experience</p>
                        </div>
                      </div>
                      <Badge className={`${getLanguageBadgeColor(experience.language)} font-medium border px-3 py-1`}>
                        {getLanguageLabel(experience.language)}
                      </Badge>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</p>
                          <p className="font-medium text-slate-900">{experience.name || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</p>
                          <p className="font-medium text-slate-900 font-mono">{experience.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date</p>
                          <p className="font-medium text-slate-900">{new Date(experience.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Experience Content */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-slate-600" />
                        <h4 className="font-semibold text-slate-900">Experience Shared:</h4>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                          {experience.experience}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Submitted on {new Date(experience.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                          <FileText className="w-3 h-3 mr-1" />
                          {experience.experience.length} characters
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}