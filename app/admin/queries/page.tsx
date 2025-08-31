"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, Filter, Download, RefreshCw, Calendar, Users, Database, MapPin, Languages, Phone, User } from "lucide-react"

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
  const [exportLoading, setExportLoading] = useState(false)
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
      setLoading(true)
      const response = await fetch("/api/admin/queries")
      if (response.ok) {
        const data = await response.json()
        const uniqueQueries = data.filter(
          (query: UserQuery, index: number, self: UserQuery[]) => index === self.findIndex((q) => q.id === query.id),
        )
        setQueries(uniqueQueries)
      } else {
        console.error("Failed to fetch queries:", response.status)
      }
    } catch (error) {
      console.error("Error fetching queries:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = queries

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (query) =>
          query.name.toLowerCase().includes(searchLower) ||
          query.phone.includes(searchTerm) ||
          query.block_name.toLowerCase().includes(searchLower) ||
          query.ward_name.toLowerCase().includes(searchLower) ||
          query.booth_name.toLowerCase().includes(searchLower) ||
          query.venue.toLowerCase().includes(searchLower) ||
          query.habitation.toLowerCase().includes(searchLower) ||
          query.ac.toLowerCase().includes(searchLower) ||
          query.id.toString().includes(searchTerm),
      )
    }

    if (filters.blockName !== "all") {
      filtered = filtered.filter((query) => query.block_name === filters.blockName)
    }

    if (filters.wardName !== "all") {
      filtered = filtered.filter((query) => query.ward_name === filters.wardName)
    }

    if (filters.language !== "all") {
      filtered = filtered.filter((query) => query.language === filters.language)
    }

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
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "bn":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "hi":
        return "bg-orange-50 text-orange-700 border-orange-200"
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
      case "hi":
        return "Hindi"
      default:
        return language
    }
  }

  const exportToExcel = async () => {
    try {
      setExportLoading(true)
      console.log("[v0] Starting Excel export...")

      const queryParams = new URLSearchParams({
        blockName: filters.blockName,
        wardName: filters.wardName,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        language: filters.language,
        search: searchTerm,
      })

      console.log("[v0] Export URL:", `/api/admin/queries/export?${queryParams}`)

      const response = await fetch(`/api/admin/queries/export?${queryParams}`)

      console.log("[v0] Export response status:", response.status)

      if (response.ok) {
        const blob = await response.blob()
        console.log("[v0] Blob size:", blob.size)

        if (blob.size === 0) {
          alert("No data to export. Please check your filters.")
          return
        }

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `user-queries-${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        console.log("[v0] Export completed successfully")
      } else {
        const errorText = await response.text()
        console.error("[v0] Export failed:", response.status, response.statusText, errorText)
        alert(`Failed to export data: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("[v0] Error exporting to Excel:", error)
      alert("Failed to export data. Please check your internet connection and try again.")
    } finally {
      setExportLoading(false)
    }
  }

  // Get statistics for the dashboard cards
  const getStatistics = () => {
    const totalQueries = queries.length
    const filteredTotal = filteredQueries.length
    const languages = Array.from(new Set(queries.map(q => q.language))).length
    const blocks = Array.from(new Set(queries.map(q => q.block_name))).length
    
    return { totalQueries, filteredTotal, languages, blocks }
  }

  const stats = getStatistics()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading queries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
                <h1 className="text-2xl font-bold text-slate-900">User Queries Management</h1>
                <p className="text-slate-600 text-sm">Monitor and analyze user queries data</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={fetchQueries}
                variant="outline"
                disabled={loading}
                className="bg-white hover:bg-slate-50 border-slate-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={exportToExcel}
                disabled={exportLoading || filteredQueries.length === 0}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export ({filteredQueries.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Queries</p>
                  <p className="text-2xl font-bold">{stats.totalQueries.toLocaleString()}</p>
                </div>
                <Database className="w-8 h-8 text-blue-200" />
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
                <Users className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Languages</p>
                  <p className="text-2xl font-bold">{stats.languages}</p>
                </div>
                <Languages className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Blocks</p>
                  <p className="text-2xl font-bold">{stats.blocks}</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle className="flex items-center text-slate-800">
              <Filter className="w-5 h-5 mr-3 text-blue-600" />
              Advanced Filters & Search
            </CardTitle>
            <CardDescription className="text-slate-600">
              Use powerful filters to find specific queries and analyze data patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <Select
                value={filters.blockName}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, blockName: value }))}
              >
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500">
                  <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  placeholder="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="pl-10 bg-white border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  placeholder="To Date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="pl-10 bg-white border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-slate-700">
                  Showing <span className="font-bold text-blue-600">{filteredQueries.length}</span> of{" "}
                  <span className="font-bold">{queries.length}</span> queries
                </p>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
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

        {/* Data Table */}
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle className="text-slate-800">User Queries Database</CardTitle>
            <CardDescription className="text-slate-600">
              Comprehensive view of all user queries with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredQueries.length === 0 ? (
              <div className="text-center py-16">
                <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-medium">No queries found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700">ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Name
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Phone
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">Block</TableHead>
                      <TableHead className="font-semibold text-slate-700">Ward/GP</TableHead>
                      <TableHead className="font-semibold text-slate-700">Electoral Booth</TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        <div className="flex items-center">
                          <Languages className="w-4 h-4 mr-2" />
                          Language
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">Query Date</TableHead>
                      <TableHead className="font-semibold text-slate-700">Camp Date</TableHead>
                      <TableHead className="font-semibold text-slate-700">Venue</TableHead>
                      <TableHead className="font-semibold text-slate-700">Habitation</TableHead>
                      <TableHead className="font-semibold text-slate-700">AC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueries.map((query, index) => (
                      <TableRow 
                        key={`query-${query.id}-${index}`} 
                        className="hover:bg-blue-50/30 transition-colors duration-200 border-b border-slate-100"
                      >
                        <TableCell className="font-mono text-sm font-medium text-slate-900">
                          #{query.id}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {query.name || <span className="text-slate-400 italic">Not provided</span>}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {query.phone || <span className="text-slate-400 italic">Not provided</span>}
                        </TableCell>
                        <TableCell className="text-slate-700">{query.block_name}</TableCell>
                        <TableCell className="text-slate-700">{query.ward_name}</TableCell>
                        <TableCell className="text-slate-700">{query.booth_name}</TableCell>
                        <TableCell>
                          <Badge className={`${getLanguageBadgeColor(query.language)} font-medium border`}>
                            {getLanguageLabel(query.language)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 font-mono text-sm">
                          {new Date(query.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-slate-600 font-mono text-sm">
                          {query.camp_date ? new Date(query.camp_date).toLocaleDateString() : (
                            <span className="text-slate-400 italic">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {query.venue || <span className="text-slate-400 italic">N/A</span>}
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {query.habitation || <span className="text-slate-400 italic">N/A</span>}
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {query.ac || <span className="text-slate-400 italic">N/A</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}