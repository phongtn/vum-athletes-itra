"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchQuery: string
  nationalities: string[]
  categories: string[]
}

export interface FilterOptions {
  gender: string | null
  nationality: string | null
  category: string | null
}

export function FilterBar({ onFilterChange, onSearchChange, searchQuery, nationalities, categories }: FilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    gender: null,
    nationality: null,
    category: null,
  })
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom")
  const filterBarRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setActiveFilter(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Determine dropdown position when toggling filter
  const toggleFilter = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null)
      return
    }

    // Check available space below the filter bar
    if (filterBarRef.current) {
      const rect = filterBarRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceNeeded = filter === "nationality" ? 300 : 200 // Nationality dropdown needs more space

      if (spaceBelow < spaceNeeded) {
        setDropdownPosition("top")
      } else {
        setDropdownPosition("bottom")
      }
    }

    setActiveFilter(filter)
  }

  const handleFilterChange = (type: keyof FilterOptions, value: string | null) => {
    const newFilters = { ...filters, [type]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
    setActiveFilter(null) // Close dropdown after selection
  }

  const genderOptions = ["M", "F"]

  return (
    <div className="bg-[#a8d36a] text-white mb-4 rounded-sm overflow-visible" ref={filterBarRef}>
      {/* Desktop view */}
      <div className="hidden md:grid md:grid-cols-3 divide-x">
        <div className="relative">
          <button
            className="flex items-center justify-between px-4 py-3 w-full hover:bg-[#94c946] transition-colors"
            onClick={() => toggleFilter("gender")}
          >
            <span>GENDER</span>
            <div className="flex items-center gap-2">
              <span>{filters.gender || "-"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${activeFilter === "gender" ? "rotate-180" : ""}`}
              />
            </div>
          </button>
          {activeFilter === "gender" && (
            <div
              className={`absolute ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"} left-0 w-full bg-[#94c946] z-50 shadow-lg rounded-sm`}
            >
              <div className="p-2">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-[#e7e9ea] rounded-sm"
                  onClick={() => handleFilterChange("gender", null)}
                >
                  All Genders
                </button>
                {genderOptions.map((gender) => (
                  <button
                    key={gender}
                    className={`w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm ${filters.gender === gender ? "bg-[#002a80]" : ""}`}
                    onClick={() => handleFilterChange("gender", gender)}
                  >
                    {gender === "M" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center justify-between px-4 py-3 w-full hover:bg-[#94c946] transition-colors"
            onClick={() => toggleFilter("nationality")}
          >
            <span>NATIONALITY</span>
            <div className="flex items-center gap-2">
              <span>{filters.nationality || "-"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${activeFilter === "nationality" ? "rotate-180" : ""}`}
              />
            </div>
          </button>
          {activeFilter === "nationality" && (
            <div
              className={`absolute ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"} left-0 w-full bg-[#94c946] z-50 shadow-lg rounded-sm max-h-64 overflow-y-auto`}
            >
              <div className="p-2">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm"
                  onClick={() => handleFilterChange("nationality", null)}
                >
                  All Nationalities
                </button>
                {nationalities.map((nationality) => (
                  <button
                    key={nationality}
                    className={`w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm ${filters.nationality === nationality ? "bg-[#002a80]" : ""}`}
                    onClick={() => handleFilterChange("nationality", nationality)}
                  >
                    {nationality}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center justify-between px-4 py-3 w-full hover:bg-[#94c946] transition-colors"
            onClick={() => toggleFilter("category")}
          >
            <span>CATEGORY</span>
            <div className="flex items-center gap-2">
              <span>{filters.category || "-"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${activeFilter === "category" ? "rotate-180" : ""}`}
              />
            </div>
          </button>
          {activeFilter === "category" && (
            <div
              className={`absolute ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"} left-0 w-full bg-[#94c946] z-50 shadow-lg rounded-sm max-h-64 overflow-y-auto`}
            >
              <div className="p-2">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm"
                  onClick={() => handleFilterChange("category", null)}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm ${filters.category === category ? "bg-[#002a80]" : ""}`}
                    onClick={() => handleFilterChange("category", category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden grid grid-cols-1">
        <div className="grid grid-cols-3 divide-x">
          <div className="relative">
            <button
              className="flex items-center justify-between px-3 py-2 w-full hover:bg-[#94c946] transition-colors text-xs"
              onClick={() => toggleFilter("gender")}
            >
              <span className="truncate">GENDER</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="truncate">{filters.gender || "-"}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${activeFilter === "gender" ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {activeFilter === "gender" && (
              <div className="absolute top-full mt-1 left-0 w-full bg-[#94c946] z-50 shadow-lg rounded-sm">
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#e7e9ea] rounded-sm text-xs"
                    onClick={() => handleFilterChange("gender", null)}
                  >
                    All Genders
                  </button>
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      className={`w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm text-xs ${filters.gender === gender ? "bg-[#002a80]" : ""}`}
                      onClick={() => handleFilterChange("gender", gender)}
                    >
                      {gender === "M" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center justify-between px-3 py-2 w-full hover:bg-[#94c946] transition-colors text-xs"
              onClick={() => toggleFilter("nationality")}
            >
              <span className="truncate">NAT.</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="truncate max-w-[40px]">{filters.nationality || "-"}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${activeFilter === "nationality" ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {activeFilter === "nationality" && (
              <div className="absolute top-full mt-1 left-0 w-screen max-w-[250px] bg-[#94c946] z-50 shadow-lg rounded-sm max-h-64 overflow-y-auto">
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm text-xs"
                    onClick={() => handleFilterChange("nationality", null)}
                  >
                    All Nationalities
                  </button>
                  {nationalities.map((nationality) => (
                    <button
                      key={nationality}
                      className={`w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm text-xs ${filters.nationality === nationality ? "bg-[#002a80]" : ""}`}
                      onClick={() => handleFilterChange("nationality", nationality)}
                    >
                      {nationality}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center justify-between px-3 py-2 w-full hover:bg-[#94c946] transition-colors text-xs"
              onClick={() => toggleFilter("category")}
            >
              <span className="truncate">CAT.</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="truncate max-w-[40px]">{filters.category || "-"}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${activeFilter === "category" ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {activeFilter === "category" && (
              <div className="absolute top-full mt-1 right-0 w-screen max-w-[250px] bg-[#94c946] z-50 shadow-lg rounded-sm max-h-64 overflow-y-auto">
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm text-xs"
                    onClick={() => handleFilterChange("category", null)}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`w-full text-left px-3 py-2 hover:bg-[#002a80] rounded-sm text-xs ${filters.category === category ? "bg-[#002a80]" : ""}`}
                      onClick={() => handleFilterChange("category", category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-[#a8d36a] border-t border-white">
        <input
          type="text"
          placeholder="Search for a runner"
          className="w-full px-3 py-2 bg-white text-gray-900 rounded-sm focus:outline-none"
          onChange={onSearchChange}
          value={searchQuery}
        />
      </div>
    </div>
  )
}

