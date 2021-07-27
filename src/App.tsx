import React, { useCallback, useEffect, useState } from 'react'
import {
  AuthorSection,
  FiltersSection,
  Quotes,
  TagPill,
  TagSection,
} from './components'
import { Author, AuthorsApiResponse, Quote, QuotesApiResponse, RequestConfig } from './types'

//#region module (top) level

const API_URL = 'https://api.quotable.io/'

//#region Colors

/**
 * Gets a random color code.
 * @returns a random hexdecimal color code
 */
export const getRandomColor = () => {
  // list all hex characters in a string
  const letters = '0123456789ABCDEF'

  // Set up a string with the leading '#'
  let color: string = '#'

  // Assign the letters one-by-one until all 6 are assigned
  for (let i = 0; i < 6; i++) {
    // Get 6 randomly-selected character from the letters string
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color
}

/**
 * The default color for the filter pills
 */
export const filterPillColor = getRandomColor()

/**
 * The color of the filter pills when a matching filter is applied.
 */
export const selectedColor = '#61863f'

/**
 * The background of the top portion of the quote card
 */
export const quoteCardTopColor = getRandomColor()

/**
 * The background color of the bottom portion of the quote card.
 */
export const quoteCardBottomColor = '#cccccc'
//#endregion

//#region Types

//#endregion

/**
 * Gets a URL string matching the configuration options
 * @param config
 * @returns `string`
 */
export const getConfiguredRequestUrl = (config: RequestConfig): string => {
  // If `id` is passed as an option, return the `/:id` URL variant
  if (config.options && 'id' in config.options) {
    return `${API_URL}/${config.type}/${config.options.id}}`
  } else {
    // Construct an array of strings representing the queries for the URL.
    const queries = config.options
      ? Object.entries(config.options)
          // Filter out undefined values - implicit return syntax
          .filter((optEntry) => optEntry[1])
          // Produce a new array of strings in the form `key=value` - explicit return syntax
          .map(([key, value]) => {
            return `${key}=${value}`
          })
      : []

    // Construct the URL.
    const configuredUrl = `${API_URL}${config.type}${
      queries.length ? '?' : ''
    }${queries.join('&')}`

    return configuredUrl
  }
}

/**
 * Detect the presece or absense of the `filter` in `filters`
 * and add or remove it, then return the new set of filter strings.
 * @param filter : string;
 * @param filters : string[]
 * @returns `string[]`
 */
const toggle = (filter: string, filters?: string[]) => {
  // Check if `filter` is present in `filters`
  if (filters?.includes(filter)) {
    // Remove `filter` from `filters`
    return filters.filter((term) => filter !== term)
    // Check if `filter` is not present in `filters` and `filters` is an array
  } else if (Array.isArray(filters)) {
    // Add `filter` to `filters`
    return [...filters, filter]
    // Check if `filter` is not present in `filters` and `filters` is not an array
  } else {
    // Return the provided filter as a single element array
    return [filter]
  }
}

/**
 * Get all the elements of `arrA` that do not appear in `arrB`
 * @param arrA
 * @param arrB
 * @returns `string[]`
 */
const getDifference = (arrA: string[], arrB: string[]) => {
  return arrA.filter((element) => !arrB.includes(element))
}

//#endregion

//#region Component
const App = () => {
  //#region Component Body

  //#region State

  // Currently Applied Filters
  const [tagFilters, setTagFilters] = useState<string[] | undefined>(undefined)

  const [authorFilters, setAuthorFilters] = useState<string[] | undefined>(
    undefined,
  )

  // Combined list of filters
  //const filters = [...(tagFilters ?? []), ...(authorFilters ?? [])]

  // Available Filters

  // Author Pagination

  // Sections Visibility

  // Displayed Quotes
  const [quotes, setQuotes] = useState<Quote[] | undefined>(undefined)

  // Author Information Cache
  const [authorInfo, setAuthorInfo] = useState<Author[] | undefined>(undefined)

  // List of slugs from the cache
  //const authorInfoSlugs = (authorInfo ?? []).map((ai) => ai.slug)

  /**
   * Cache `Authors` in `newAuthors` if they do not already appear in the cache
   * @param newAuthors : `Author[]`
   */
  const cacheAuthors = useCallback(
    (newAuthors: Author[]) => {
      console.log('cacheAuthors')
      // Gather the slugs of the authors already in the cache
      const existingSlugs = authorInfo?.map((author) => author.slug)

      // Gather the slugs of the authors in the `newAuthors` parameter
      const newAuthorsSlugs = newAuthors.map((author) => author.slug)

      // Gather only new slugs that are not already in cache
      const newSlugs = existingSlugs?.length
        ? getDifference(newAuthorsSlugs, existingSlugs)
        : newAuthorsSlugs

      // Gather the Author info associated with the newSlugs
      const newAuthorInfo = newAuthors.filter((result) => {
        return newSlugs.includes(result.slug)
      })

      // Add the new authors' info to the cache
      setAuthorInfo([...(authorInfo ?? []), ...newAuthorInfo])
    },
    [authorInfo],
  )
  //#endregion

  // Effects

  // Respond to changes in filters
  useEffect(() => {
    // Get a new request url with the current filters.
    const quotesUrl = getConfiguredRequestUrl({
      type: 'quotes',
      options: {
        author: authorFilters?.join('|'),
        tags: tagFilters?.join('|'),
      },
    })

    // Call the API with the constructed URL
    fetch(quotesUrl).then((res) => {
      //Get the JSON data from the `Response`
      res.json().then((data: QuotesApiResponse) => {
        // Gather the `authorSlug` for each quote in the response data.
        const quotesAuthorSlugs = data.results.map((r) => r.authorSlug)

        // Configure a URL to get the Author info for all the new Authors
        if (quotesAuthorSlugs.length) {
          const quotesAuthorsUrl = getConfiguredRequestUrl({
            type: 'authors',
            options: {
              slug: quotesAuthorSlugs.join('|'),
            },
          })

          // Call the API for the Authors' info
          fetch(quotesAuthorsUrl).then((authorsResponse) => {
            authorsResponse.json().then((authorsData: AuthorsApiResponse) => {
              // Add the Author's info to the `authorInfo` cache
              cacheAuthors(authorsData.results)
            })
          })
        }

        // Display the fetched quotes
        setQuotes(data.results)
      })
    })
    // Execute this effect on-load and every time the filters change
    //@ts-ignore
  }, [authorFilters, tagFilters])

  /**
   * Add or remove the `filter` from the `filters` of the specified `type`
   * @param type : `author | tag`
   * @param filter : `string`
   * @returns `void`
   */
  const toggleFilter = (type: 'author' | 'tag', filter: string) => {
    switch (type) {
      case 'author':
        // Get the toggled author filters list
        const newAuthorFilters = toggle(filter, authorFilters)
        // Update authorFilters state (will trigger effect)
        setAuthorFilters(newAuthorFilters)
        break
      case 'tag':
        // Get the toggled tag filters list
        const newTagFilters = toggle(filter, tagFilters)
        // Update tagFilters state (will trigger effect)
        setTagFilters(newTagFilters)
    }
  }
  //#endregion
  return (
    <Layout>
      <FiltersDisplay>
        <TagSection tagFilters={tagFilters} toggleFilter={toggleFilter} />
        <AuthorSection
          authorFilters={authorFilters}
          toggleFilter={toggleFilter}
          cacheAuthors={cacheAuthors}
        />
      </FiltersDisplay>
      <MainDisplay>
        <Quotes quotes={quotes} toggleFilter={toggleFilter} authorFilters={authorFilters} tagFilters={tagFilters}/>
      </MainDisplay>
    </Layout>
  )
}
//#endregion
export default App

const Layout: React.FC = ({ children }) => {
  return (
    <div
    // use `display: "grid" ` for better control of the top-level layout.
    // the gridTemplateColumns property will be very useful.
      style={{
        // maxHeight: '100vh',
        // maxWidth: '1200px',
        // width: '100vw',
        display: 'flex',
        // alignItems: 'start',
        // gridTemplateColumns: '1/3',
        background: '#1DBA92',
        // gridTemplateAreas: "filterBar quotes"
      }}
    >
      {children}
    </div>
  )
}

const FiltersDisplay: React.FC = ({ children }) => {
  return (
    <div>
      <div
        style={{
          // height: '20vh',
          width: '20vw',
          // maxWidth: "300px",
          display: 'grid',
          gap: '5px',
          // position: 'fixed',
          background: '#F9CF0E',
          padding: '15px 15px 15px 15px',
          gridArea: "filterBar"
        }}
      >
        {children}
      </div>
    </div>
  )
}

const MainDisplay: React.FC = ({ children }) => {
  return (
    <div
    style={{
      height: '100vh',
      width: '80vw',
      // maxWidth: "80px",
      background: '#C708C1',
      gridArea: 'quotes',
      // padding: '0px 20px 0px 20px',
      overflowY: "scroll"
    }}
    >
      {children}
    </div>
  )
}
