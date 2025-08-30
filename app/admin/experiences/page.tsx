"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, Calendar, User, Phone, MessageSquare } from "lucide-react"

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-foreground">User Experiences</h1>
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
              Filters
            </CardTitle>
            <CardDescription>Filter experiences by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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
                Showing {filteredExperiences.length} of {experiences.length} experiences
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Experiences List */}
        <div className="space-y-4">
          {filteredExperiences.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No experiences found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredExperiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Experience #{experience.id}
                      </h3>
                      <Badge className={getLanguageBadgeColor(experience.language)}>
                        {getLanguageLabel(experience.language)}
                      </Badge>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">{experience.name || "Not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{experience.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">{new Date(experience.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Experience Content */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Experience Shared:</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{experience.experience}</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border">
                      <span>Submitted on {new Date(experience.created_at).toLocaleString()}</span>
                      <span>{experience.experience.length} characters</span>
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
