"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [country, setCountry] = useState(searchParams.get("country") || "us")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (country) params.set("country", country)
    if (category && category !== "all") params.set("category", category)

    router.push(`/?${params.toString()}`)
  }

  // Update filters when URL changes
  useEffect(() => {
    setCountry(searchParams.get("country") || "us")
    setCategory(searchParams.get("category") || "all")
  }, [searchParams])

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 space-y-1">
        <label className="text-sm font-medium">Country</label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="gb">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
            <SelectItem value="in">India</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1">
        <label className="text-sm font-medium">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button onClick={applyFilters} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

