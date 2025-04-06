"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GenerateSummaryButtonProps {
  articleSlug: string
}

export function GenerateSummaryButton({ articleSlug }: GenerateSummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSummary = async () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, we would call an API to generate the summary
      // and then update the UI with the result
      setIsGenerating(false)

      // For now, we'll just show an alert
      alert("Summary generation will be implemented later with an AI model. This is a placeholder button for now.")
    }, 1500)
  }

  return (
    <Button onClick={handleGenerateSummary} disabled={isGenerating} className="w-full">
      <Sparkles className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Generate Summary"}
    </Button>
  )
}

