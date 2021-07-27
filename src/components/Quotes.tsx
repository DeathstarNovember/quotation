import React from 'react'
import { FiltersSection, TagPill } from '.'
import {
  filterPillColor,
  quoteCardBottomColor,
  quoteCardTopColor,
} from '../App'
import {
  Quote,
  ToggleFilterFunction,
} from '../types'

export const Quotes = ({
  quotes,
  toggleFilter, authorFilters,
  tagFilters
}: {
  quotes?: Quote[]
  toggleFilter: ToggleFilterFunction
  authorFilters?: string[] 
  tagFilters?: string[] 
}) => {
  return quotes ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h3>Quotes</h3>
      <FiltersSection
          authorFilters={authorFilters}
          tagFilters={tagFilters}
          toggleFilter={toggleFilter}
        />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {quotes.length ?  quotes.map((result: Quote) => {
          return (
            <div
              key={result._id}
              style={{
                width: '50vw',
                gap: 10,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  backgroundColor: quoteCardTopColor,
                  borderRadius: '10px 10px 0 0',
                  padding: 15,
                }}
              >
                {result.content}
              </div>
              <div
                style={{
                  backgroundColor: quoteCardBottomColor,
                  borderRadius: '0 0 10px 10px',
                  padding: 15,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleFilter('author', result.author)}
                >
                  ~{result.author}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {result.tags.map((tag) => (
                    <TagPill
                      key={`TagPill ${tag}`}
                      tag={tag}
                      quote={result}
                      onClick={() => toggleFilter('tag', tag)}
                      color={filterPillColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        }):(<div>No Quotes match your filter selection.</div>)}
      </div>
    </div>
  ) : null
}
