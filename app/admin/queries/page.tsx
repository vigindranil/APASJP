"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, Filter, Download } from "lucide-react"

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
        return "bg-blue-100 text-blue-800"
      case "bn":
        return "bg-green-100 text-green-800"
      case "np":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading queries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-foreground">User Queries</h1>
            </div>
            <Button
              onClick={exportToExcel}
              disabled={exportLoading || filteredQueries.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export to Excel ({filteredQueries.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & Search
            </CardTitle>
            <CardDescription>Search and filter queries by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, location, venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.blockName}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, blockName: value }))}
              >
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
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
              />

              <Input
                type="date"
                placeholder="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredQueries.length} of {queries.length} queries
                {searchTerm && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Search: "{searchTerm}"
                  </span>
                )}
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Queries Data</CardTitle>
            <CardDescription>Detailed view of all user queries in tabular format</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQueries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No queries found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Ward/GP</TableHead>
                      <TableHead>Electoral Booth</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Query Date</TableHead>
                      <TableHead>Camp Date</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Habitation</TableHead>
                      <TableHead>AC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueries.map((query, index) => (
                      <TableRow key={`query-${query.id}-${index}`} className="hover:bg-muted/50">
                        <TableCell className="font-medium">#{query.id}</TableCell>
                        <TableCell>{query.name || "Not provided"}</TableCell>
                        <TableCell>{query.phone || "Not provided"}</TableCell>
                        <TableCell>{query.block_name}</TableCell>
                        <TableCell>{query.ward_name}</TableCell>
                        <TableCell>{query.booth_name}</TableCell>
                        <TableCell>
                          <Badge className={getLanguageBadgeColor(query.language)}>
                            {getLanguageLabel(query.language)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {query.camp_date ? new Date(query.camp_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{query.venue || "N/A"}</TableCell>
                        <TableCell>{query.habitation || "N/A"}</TableCell>
                        <TableCell>{query.ac || "N/A"}</TableCell>
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
