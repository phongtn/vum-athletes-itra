"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { FilterOptions } from "./filter-bar"

// Update the Runner interface to match the actual data structure from the JSON file
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

// Update the RunnersTableProps interface
interface RunnersTableProps {
  runners: Runner[]
  filters: FilterOptions
  searchQuery: string
  getCategoryFromRunner: (runner: Runner) => string
  loading: boolean
}

// Update the RunnersTable component parameters
export function RunnersTable({ runners, filters, searchQuery, getCategoryFromRunner, loading }: RunnersTableProps) {
  const [filteredRunners, setFilteredRunners] = useState<Runner[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Define runnersPerPage as a constant outside of the component state
  const runnersPerPage = 10

  // Apply filters whenever they change or when runners/search changes
  useEffect(() => {
    if (runners.length === 0) return

    let result = [...runners]

    if (filters.gender) {
      result = result.filter((runner) => runner[1].gender === filters.gender)
    }

    if (filters.nationality) {
      result = result.filter((runner) => runner[1].nationality === filters.nationality)
    }

    if (filters.category) {
      // Filter by the actual category value
      result = result.filter((runner) => getCategoryFromRunner(runner) === filters.category)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (runner) =>
          runner[0]
            .toLowerCase()
            .includes(query) || // Name
          runner[1].bib.toLowerCase().includes(query), // BIB
      )
    }

    setFilteredRunners(result)
    setTotalPages(Math.ceil(result.length / runnersPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [runners, filters, getCategoryFromRunner, searchQuery])

  // Calculate paginated runners based on current page - using useMemo instead of useEffect
  const paginatedRunners = useMemo(() => {
    const startIndex = (currentPage - 1) * runnersPerPage
    const endIndex = startIndex + runnersPerPage
    return filteredRunners.slice(startIndex, endIndex)
  }, [filteredRunners, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <>
      <div className="bg-white rounded-sm shadow overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid md:grid-cols-5 bg-gray-100 text-sm text-gray-600 py-3 px-4">
          <div className="col-span-1">BIB</div>
          <div className="col-span-1">RUNNER</div>
          <div className="col-span-1">NAT.</div>
          <div className="col-span-1">
            <span className="bg-[#94c946] text-white px-2 py-0.5 rounded-sm text-xs">ITRA</span>
          </div>
          <div className="col-span-1">CAT.</div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden grid grid-cols-12 bg-gray-100 text-sm text-gray-600 py-3 px-4">
          <div className="col-span-2">BIB</div>
          <div className="col-span-6">RUNNER</div>
          <div className="col-span-4">DETAILS</div>
        </div>

        {paginatedRunners.length > 0 ? (
          paginatedRunners.map((runner, index) => (
            <RunnerRow
              key={runner[1].bib}
              runner={runner}
              rank={(currentPage - 1) * runnersPerPage + index + 1}
              getCategory={getCategoryFromRunner}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No runners match the selected filters. Try adjusting your filters.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        {/* Powered by text */}
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          {/*Powered By <span className="font-bold">LIVETRAIL</span>*/}
        </div>

        {/* Total runners count */}
        <div className="text-sm text-gray-500 order-1 sm:order-2">
          <span className="font-medium">{filteredRunners.length}</span> runners found
        </div>
      </div>

      {filteredRunners.length > 0 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Show first 5 pages or less if fewer pages */}
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNumber = i + 1
            return (
              <Button
                key={i}
                variant={currentPage === pageNumber ? "default" : "outline"}
                className={`rounded-full w-8 h-8 p-0 ${currentPage === pageNumber ? "bg-[#001440]" : ""}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}

          {/* If more than 5 pages, show ellipsis and last page */}
          {totalPages > 5 && (
            <>
              {/* If current page is beyond first 5 pages, show current page */}
              {currentPage > 5 && (
                <>
                  <span className="mx-1">...</span>
                  <Button
                    variant="default"
                    className="rounded-full w-8 h-8 p-0 bg-[#001440]"
                    onClick={() => handlePageChange(currentPage)}
                  >
                    {currentPage}
                  </Button>
                </>
              )}

              {/* Always show ellipsis and last page if not already showing current page */}
              {(currentPage <= 5 || currentPage < totalPages) && (
                <>
                  <span className="mx-1">...</span>
                  <Button
                    variant="outline"
                    className="rounded-full w-8 h-8 p-0"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}

// Update the RunnerRow props to match the new Runner interface
interface RunnerRowProps {
  runner: Runner
  rank: number
  getCategory: (runner: Runner) => string
}

// In the RunnerRow component, update how we access the runner data
function RunnerRow({ runner, rank, getCategory }: RunnerRowProps) {
  const name = runner[0]
  const data = runner[1]

  // Get category using the provided function
  const category = getCategory(runner)

  // Desktop view
  return (
    <>
      {/* Desktop view */}
      <div
        className={`hidden md:grid md:grid-cols-5 py-4 px-4 border-b text-sm ${rank % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
      >
        <div className="col-span-1 flex items-center">
          <span className="font-medium">{data.bib}</span>
        </div>

        <div className="col-span-1 flex items-center gap-3">
          <Avatar className="h-12 w-12 border rounded-full">
            <AvatarImage
              src={data.profile !== "None" ? data.profile : "/placeholder.svg?height=48&width=48"}
              alt={name}
            />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            {data.club && data.club !== "None" && <span className="text-xs text-gray-500">{data.club}</span>}
          </div>
        </div>

        <div className="col-span-1 flex items-center">
          {data.flag !== "None" ? (
            <div className="flex items-center gap-1">
              <Image
                src={data.flag || "/placeholder.svg"}
                alt={data.nationality}
                width={20}
                height={15}
                className="rounded-sm"
              />
              <span className="text-xs">{data.nationality.substring(0, 2).toUpperCase()}</span>
            </div>
          ) : (
            <span className="text-xs">{data.nationality.substring(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="col-span-1 flex items-center">
          <span className="font-bold">{data.pi}</span>
        </div>

        <div className="col-span-1 flex items-center">{category}</div>
      </div>

      {/* Mobile view */}
      <div
        className={`md:hidden grid grid-cols-12 py-4 px-4 border-b text-sm ${rank % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
      >
        <div className="col-span-2 flex items-center">
          <span className="font-medium">{data.bib}</span>
        </div>

        <div className="col-span-6 flex items-center gap-2 overflow-hidden">
          <Avatar className="h-8 w-8 border rounded-full shrink-0">
            <AvatarImage
              src={data.profile !== "None" ? data.profile : "/placeholder.svg?height=32&width=32"}
              alt={name}
            />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-xs">{name}</span>
            {data.club && data.club !== "None" && <span className="text-xs text-gray-500 truncate">{data.club}</span>}
          </div>
        </div>

        <div className="col-span-4 flex flex-col justify-center text-xs">
          <div className="flex items-center gap-1 mb-1">
            {data.flag !== "None" && (
              <Image
                src={data.flag || "/placeholder.svg"}
                alt={data.nationality}
                width={16}
                height={12}
                className="rounded-sm"
              />
            )}
            <span>{data.nationality.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-semibold text-xs">ITRA:</span> {data.pi}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-xs">CAT:</span> {category}
          </div>
        </div>
      </div>
    </>
  )
}

function LoadingState() {
  return (
    <div className="bg-white rounded-sm shadow overflow-hidden">
      {/* Desktop loading header */}
      <div className="hidden md:grid md:grid-cols-5 bg-gray-100 text-sm text-gray-600 py-3 px-4">
        <div className="col-span-1">BIB</div>
        <div className="col-span-1">RUNNER</div>
        <div className="col-span-1">NAT.</div>
        <div className="col-span-1">ITRA</div>
        <div className="col-span-1">CAT.</div>
      </div>

      {/* Mobile loading header */}
      <div className="md:hidden grid grid-cols-12 bg-gray-100 text-sm text-gray-600 py-3 px-4">
        <div className="col-span-2">BIB</div>
        <div className="col-span-6">RUNNER</div>
        <div className="col-span-4">DETAILS</div>
      </div>

      {/* Desktop loading rows */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="hidden md:grid md:grid-cols-5 py-4 px-4 border-b">
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1 flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}

      {/* Mobile loading rows */}
      {[...Array(10)].map((_, i) => (
        <div key={`mobile-${i}`} className="md:hidden grid grid-cols-12 py-4 px-4 border-b">
          <div className="col-span-2">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="col-span-6 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

