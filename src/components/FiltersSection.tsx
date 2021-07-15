import React, { useState } from 'react'
import { ToggleFilterFunction } from '../types'

export const FiltersSection = ({
  authorFilters,
  tagFilters,
  toggleFilter,
}: {

  authorFilters?: string[]
  tagFilters?: string[]
  toggleFilter: ToggleFilterFunction
}) => {
  const filters = [...(tagFilters ?? []), ...(authorFilters ?? [])]    // Combined list of filters
  const [filtersVisible, setFiltersVisible] = useState(true)  // Sections Visibility

  // ------------------------Visibility Handlers
  /**
   * Show active filters section
   */
  const showFilters = () => {
    setFiltersVisible(true)
  }
    /**
   * Hide active filters section
   */
  const hideFilters = () => {
    setFiltersVisible(false)
    }
    
  return filters.length ? (
    filtersVisible ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button onClick={hideFilters}>Hide Filters</button>
        <div
          style={{
            display: 'grid',
            gap: 5,
            gridTemplateColumns: `repeat(${
              filters.length >= 4 ? 4 : filters.length
            }, 1fr)`,
            justifyContent: 'center',
          }}
        >
          {authorFilters?.length
            ? authorFilters.map((filter) => {
                const removeFilter = () => {
                  toggleFilter('author', filter)
                }
                return (
                  <button
                    style={{ cursor: 'pointer' }}
                    key={`filterButton${filter}`}
                    onClick={removeFilter}
                  >
                    {filter}
                  </button>
                )
              })
            : null}
          {tagFilters?.length
            ? tagFilters.map((filter) => {
                const removeFilter = () => {
                  toggleFilter('tag', filter)
                }
                return (
                  <button
                    style={{ cursor: 'pointer' }}
                    key={`filterButton${filter}`}
                    onClick={removeFilter}
                  >
                    {filter}
                  </button>
                )
              })
            : null}
        </div>
      </div>
    ) : (
      <div
        style={{
          display: 'grid',
          justifyContent: 'center',
        }}
      >
        <button onClick={showFilters}>Show Filters</button>
      </div>
    )
  ) : null
}
