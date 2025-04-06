"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"

interface SearchFiltersProps {
  initialParams: {
    q?: string
    language?: string
    sortBy?: string
    from?: string
    to?: string
  }
}

export function SearchFilters({ initialParams }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialParams.q || "")
  const [language, setLanguage] = useState(initialParams.language || "")
  const [sortBy, setSortBy] = useState(initialParams.sortBy || "publishedAt")
  const [fromDate, setFromDate] = useState(initialParams.from || "")
  const [toDate, setToDate] = useState(initialParams.to || "")

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (language) params.set("language", language)
    if (sortBy) params.set("sortBy", sortBy)
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)

    router.push(`/search?${params.toString()}`)
  }

  // Update filters when URL changes
  useEffect(() => {
    setQuery(searchParams.get("q") || "")
    setLanguage(searchParams.get("language") || "")
    setSortBy(searchParams.get("sortBy") || "publishedAt")
    setFromDate(searchParams.get("from") || "")
    setToDate(searchParams.get("to") || "")
  }, [searchParams])

  return (
    <div className="bg-muted/50 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="mr-2 h-5 w-5" />
        Search Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Search Term</label>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter keywords..." />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publishedAt">Newest first</SelectItem>
              <SelectItem value="relevancy">Relevance</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">From Date</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">To Date</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}

