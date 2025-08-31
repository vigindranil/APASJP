"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart3, 
  List, 
  X, 
  Search, 
  Calendar,
  MapPin,
  Building2,
  Users,
  Filter,
  Check,
  ChevronsUpDown,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

type CampRow = {
  id: number
  block_id: number
  ward_id: number
  camp_date: string
  venue: string | null
  habitation: string | null
  block_name?: string
  ward_name?: string
  ac?: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Combobox Component
function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyText = "No items found",
  disabled = false,
  className
}: {
  options: { id: number; name: string }[]
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  emptyText?: string
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {value
            ? options.find((option) => String(option.id) === value)?.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={option.name}
                onSelect={() => {
                  onValueChange(String(option.id))
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === String(option.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function CampsDashboard() {
  const router = useRouter()

  const { data: countResp } = useSWR("/api/admin/camps/count", fetcher)
  const totalCamps: number = useMemo(() => (countResp?.success ? (countResp.data?.count ?? 0) : 0), [countResp])

  // filters
  const [blockId, setBlockId] = useState("")
  const [wardId, setWardId] = useState("")
  const [campDate, setCampDate] = useState("")

  const { data: blocksResp } = useSWR("/api/blocks", fetcher)
  const blocks: { id: number; name: string }[] = blocksResp?.data ?? []

  const { data: wardsResp } = useSWR(blockId ? `/api/wards?blockId=${blockId}` : null, fetcher)
  const wards: { id: number; name: string }[] = wardsResp?.data ?? []

  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<{ count: number; rows: CampRow[] } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const hasActiveFilters = blockId || wardId || campDate

  const resetFilters = () => {
    setBlockId("")
    setWardId("")
    setCampDate("")
    setResults(null)
    setErrorMsg(null)
  }

  const handleSearch = async () => {
    try {
      setSearching(true)
      setErrorMsg(null)

      const params = new URLSearchParams()
      if (blockId) params.set("blockId", blockId)
      if (wardId) params.set("wardId", wardId)
      if (campDate) params.set("campDate", campDate)

      const url = `/api/admin/camps/search${params.toString() ? `?${params.toString()}` : ""}`
      const resp = await fetch(url)
      const json = await resp.json()
      if (!resp.ok || !json.success) {
        throw new Error(json.error || "Search failed")
      }
      setResults(json.data)
    } catch (e: any) {
      setErrorMsg(e.message || "Search failed")
      setResults(null)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Camps Dashboard
                </h1>
                <p className="text-slate-600 font-medium">Manage and analyze camp data efficiently</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push("/admin/dashboard")}
              className="hover:bg-slate-50 border-slate-300 shadow-sm"
            >
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-slate-50/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Camps
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {totalCamps.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500">Registered camps</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Search & Filter Camps</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Use filters to find specific camps</p>
              </div>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-auto bg-blue-50 text-blue-700 border border-blue-200">
                  <Filter className="h-3 w-3 mr-1" />
                  Filters Active
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Filters */}
              <div className="space-y-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Location Filters</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="block" className="text-sm font-medium text-slate-700">
                      Block / Municipality
                    </Label>
                    <Combobox
                      options={blocks}
                      value={blockId}
                      onValueChange={(v) => { 
                        setBlockId(v)
                        setWardId("") 
                      }}
                      placeholder="Select block..."
                      emptyText="No blocks found"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward" className="text-sm font-medium text-slate-700">
                      GP / Ward
                    </Label>
                    <Combobox
                      options={wards}
                      value={wardId}
                      onValueChange={setWardId}
                      placeholder={!blockId ? "Select block first" : "Select ward..."}
                      emptyText="No wards found"
                      disabled={!blockId}
                    />
                  </div>
                </div>
              </div>

              {/* Single Date Filter */}
              <div className="space-y-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Camp Date</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campDate" className="text-sm font-medium text-slate-700">
                    Select Date
                  </Label>
                  <div className="relative">
                    <Input 
                      id="campDate" 
                      type="date" 
                      value={campDate} 
                      onChange={(e) => setCampDate(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {hasActiveFilters ? "Filters applied - click search to update results" : "Set your filters and click search"}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button 
                  onClick={handleSearch} 
                  disabled={searching}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  {searching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Camps
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errorMsg && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <X className="h-4 w-4" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      Search Results
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      Found {results.count} camps matching your criteria
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  {results.count} Results
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-slate-200">
                        <TableHead className="font-semibold text-slate-700">Date</TableHead>
                        <TableHead className="font-semibold text-slate-700">Venue</TableHead>
                        <TableHead className="font-semibold text-slate-700">Block</TableHead>
                        <TableHead className="font-semibold text-slate-700">Ward</TableHead>
                        <TableHead className="font-semibold text-slate-700">Assembly Constituency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.rows.map((row, index) => (
                        <TableRow 
                          key={row.id} 
                          className={cn(
                            "hover:bg-slate-50 transition-colors border-slate-100",
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          )}
                        >
                          <TableCell className="font-medium">
                            {new Date(row.camp_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{row.venue || <span className="text-slate-400">—</span>}</TableCell>
                          <TableCell>{row.block_name || <span className="text-slate-400">—</span>}</TableCell>
                          <TableCell>{row.ward_name || <span className="text-slate-400">—</span>}</TableCell>
                          <TableCell>{row.ac || <span className="text-slate-400">—</span>}</TableCell>
                        </TableRow>
                      ))}
                      {results.rows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                              <Search className="h-8 w-8" />
                              <span className="font-medium">No camps found</span>
                              <span className="text-sm">Try adjusting your search criteria</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
