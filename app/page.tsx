"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { RunnersTable } from "@/components/runners-table"
import { FilterBar, type FilterOptions } from "@/components/filter-bar"
import { Footer } from "@/components/footer"

// Define the Runner interface at the top level so it can be reused
interface Runner {
  0: string // Name
  1: {
    bib: string
    age: number
    nationality: string
    gender: string
    club: string
    pi: number
    flag: string
    profile: string
  }
}

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    gender: null,
    nationality: null,
    category: null,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [runners, setRunners] = useState<Runner[]>([])
  const [nationalities, setNationalities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to determine category based on age and gender
  const getCategoryFromRunner = useCallback((runner: Runner): string => {
    const age = runner[1].age
    const gender = runner[1].gender

    let categoryPrefix = ""
    if (age < 35) categoryPrefix = "20-34"
    else if (age < 45) categoryPrefix = "35-44"
    else if (age < 55) categoryPrefix = "45-54"
    else if (age < 65) categoryPrefix = "65+"

    return `${categoryPrefix}${gender}`
  }, [])

  // Fetch runners data once on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch("/api/runners")
        const data = await response.json()

        // Store the runners data
        setRunners(data)

        // Extract unique nationalities
        const uniqueNationalities = Array.from(new Set(data.map((runner: Runner) => runner[1].nationality)))
          .filter(Boolean)
          .sort() as string[]

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((runner: Runner) => getCategoryFromRunner(runner))))
          .filter(Boolean)
          .sort() as string[]

        setNationalities(uniqueNationalities)
        setCategories(uniqueCategories)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [getCategoryFromRunner]) // Add getCategoryFromRunner to dependencies

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">VUM athletes with ITRA points</h1>
          <p className="text-sm sm:text-base text-gray-600">Explore runner data and performance metrics</p>
        </div>
      </header>

      <div className="container mx-auto px-1 sm:px-4 py-4 sm:py-6 flex-grow">
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          nationalities={nationalities}
          categories={categories}
        />
        <RunnersTable
          runners={runners}
          filters={filters}
          searchQuery={searchQuery}
          getCategoryFromRunner={getCategoryFromRunner}
          loading={loading}
        />
      </div>

      <Footer />
    </main>
  )
}

