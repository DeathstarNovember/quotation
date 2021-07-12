import React from 'react'

export const FiltersSection = ({
  filters,
  filtersVisible,
  hideFilters,
  showFilters,
  authorFilters,
  tagFilters,
  toggleFilter,
}: {
  filters: string[]
  filtersVisible: boolean
  hideFilters: () => void
  showFilters: () => void
  authorFilters?: string[]
  tagFilters?: string[]
  toggleFilter: (type: 'author' | 'tag', filter: string) => void
}) => {
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
