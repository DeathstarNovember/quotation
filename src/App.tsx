import React, { useEffect, useState } from 'react'
import { FiltersSection, Quotes, TagPill } from './components'

//#region module (top) level

const API_URL = 'https://api.quotable.io/'

//#region Colors

/**
 * Gets a random color code.
 * @returns a random hexdecimal color code
 */
const getRandomColor = () => {
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
/**
 * Common properties for API responses from quotable.io
 */
type APIResponse = {
  /**
   * Number of records listed in the response
   */
  count: number
  /**
   * Total number of records matching the request
   * in the API db.
   */
  totalCount: number
  /**
   * Current page number of results.
   */
  page: number
  /**
   * Total number of pages of results matching the
   * request.
   */
  totalPages: number
  /**
   * Position of the last result in the total list of
   * results matching the request.
   */
  lastItemIndex: number
}

/**
 * API response from the `/quotes[?]` endpoint
 */
type QuotesApiResponse = APIResponse & {
  results: Quote[]
}

/**
 * API response from the `/authors[?]` endpoint
 */
type AuthorsApiResponse = APIResponse & {
  results: Author[]
}

/**
 * Quote object type.
 */
export type Quote = {
  tags: string[]
  _id: string
  author: string
  content: string
  authorSlug: string
  length: number
  dateAdded: string
  dateModified: string
}

/**
 * API response from the `/tags` endpoint
 */
type TagResponse = Tag[]

/**
 * Tag object type
 */
type Tag = {
  _id: string
  name: string
}

/**
 * Author object type
 */
type Author = {
  /**
   * Unique id for this Author.
   */
  _id: string
  /**
   * A brief, one paragraph bio of the author. Source: wiki API
   */
  bio: string
  /**
   * A one-line description of the author. Typically it is the person's primary
   * occupation or what they are know for.
   */
  description: string
  /**
   * The link to the author's wikipedia page or official website
   */
  link: string
  /**
   * The authors full name
   */
  name: string
  /**
   * A slug is a URL-friendly ID derived from the authors name.
   */
  slug: string
  /**
   * The number of quotes by this author.
   */
  quoteCount: number
}

/**
 * Common configuration for API requests.
 */
type RequestConfigOptions = {
  id?: string
  /**
   * The maximum Length in characters ( can be combined with minLength )
   */
  maxLength?: number
  /**
   * The minimum Length in characters ( can be combined with maxLength )
   */
  minLength?: number
  /**
   * Filter quotes by tag(s). Takes a list of one or more tag names,
   * separated by a comma (meaning AND) or a pipe (meaning OR).
   * A comma separated list will match quotes that have all of the given tags.
   * While a pipe (|) separated list will match quotes that have either of the provided tags.
   */
  tags?: string
  /**
   * Get quotes by a specific author.
   * The value can be an author name or slug.
   * To get quotes by multiple authors,
   * provide a pipe separated list of author names/slugs.
   */
  author?: string
  /**
   * The field used to sort quotes
   */
  sortBy?: 'dateAdded' | 'dateModified' | 'author' | 'content'
  /**
   * The order in which results are sorted.
   * The default order depends on the sortBy field.
   * For string fields that are sorted alphabetically,
   * the default order is ascending.
   * For number and date fields, the default order is descending.
   */
  order?: 'asc' | 'desc'
  /**
   * Sets the number of results per page.
   * min: 1, max: 150, default: 20
   */
  limit?: number
  /**
   * The page of results to return.
   * If the value is greater than the total number of pages,
   * request will not return any results.
   * min: 1, default: 1
   */
  page?: number
  /**
   * Filter authors by slug. The value can be one or more author slugs.
   * To get multiple authors by slug, the value should be a pipe separated list of slugs.
   */
  slug?: string
}

/**
 * Specific configuration type for API calls to the `/authors[?]` endpoint
 */
type AuthorsRequestConfigOptions = Omit<
  RequestConfigOptions,
  'sortBy' | 'maxLength' | 'minLength' | 'tags' | 'author'
> & { sortBy?: 'dateAdded' | 'dateModified' | 'name' | 'quoteCount' }

/**
 * Specific configuration type for API calls to the `/quotes[?]` endpoint
 */
type QuotesRequestConfigOptions = Omit<RequestConfigOptions, 'slug'>

/**
 * Specific configuration type for API calls to the `/tags[?]` endpoint
 */
type TagsRequestConfigOptions = Pick<RequestConfigOptions, 'sortBy' | 'order'>

/**
 * Specific configuration type for API calls to the `/random[?]` endpoint
 */
type RandomRequestConfigOptions = Pick<
  RequestConfigOptions,
  'maxLength' | 'minLength' | 'tags' | 'author'
>

/**
 * General request configuration object type variants
 */
type RequestConfig =
  | {
      type: 'quotes'
      options?: QuotesRequestConfigOptions
    }
  | {
      type: 'authors'
      options?: AuthorsRequestConfigOptions
    }
  | {
      type: 'tags'
      options?: TagsRequestConfigOptions
    }
  | {
      type: 'random'
      options?: RandomRequestConfigOptions
    }
//#endregion

/**
 * Gets a URL string matching the configuration options
 * @param config
 * @returns `string`
 */
const getConfiguredRequestUrl = (config: RequestConfig): string => {
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

  const [tagColors, setTagColors] = useState<{ tag: string; color: string }[]>(
    [],
  )

  // Combined list of filters
  const filters = [...(tagFilters ?? []), ...(authorFilters ?? [])]

  // Available Filters
  const [tags, setTags] = useState<Tag[] | undefined>(undefined)

  const [authors, setAuthors] = useState<Author[] | undefined>(undefined)

  // Author Pagination
  const [authorPage, setAuthorPage] = useState<number>(1)

  const [authorPages, setAuthorPages] = useState<number>(1)

  // Sections Visibility
  const [tagsVisible, setTagsVisible] = useState(false)

  const [authorsVisible, setAuthorsVisible] = useState(false)

  const [filtersVisible, setFiltersVisible] = useState(true)

  // Displayed Quotes
  const [quotes, setQuotes] = useState<Quote[] | undefined>(undefined)

  // Author Information Cache
  const [authorInfo, setAuthorInfo] = useState<Author[] | undefined>(undefined)

  // List of slugs from the cache
  const authorInfoSlugs = (authorInfo ?? []).map((ai) => ai.slug)

  /**
   * Cache `Authors` in `newAuthors` if they do not already appear in the cache
   * @param newAuthors : `Author[]`
   */
  const cacheAuthors = (newAuthors: Author[]) => {
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
  }

  //#endregion

  //#region Visibility Handlers

  /**
   * Show tag filter section
   */
  const showTags = () => {
    setTagsVisible(true)
  }

  /**
   * Hide tag filter section
   */
  const hideTags = () => {
    setTagsVisible(false)
  }

  /**
   * Show author filter section
   */
  const showAuthors = () => {
    setAuthorsVisible(true)
  }

  /**
   * Hide author filter section
   */
  const hideAuthors = () => {
    setAuthorsVisible(false)
  }

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
  //#endregion

  //#region Pagination handlers

  /**
   * If possible, load the previous page of
   * author filter results in the author filters section.
   */
  const pageBack = () => {
    if (authorPage !== 1) {
      setAuthorPage(authorPage - 1)
    }
  }

  /**
   * If possible, load the next page of
   * author filter results in the author filters section.
   */
  const pageForward = () => {
    if (authorPage !== authorPages) {
      setAuthorPage(authorPage + 1)
    }
  }
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
  }, [authorFilters, tagFilters])

  // Respond to author page change
  useEffect(() => {
    // Construct a URL for the specified page
    const authorsUrl = getConfiguredRequestUrl({
      type: 'authors',
      options: { page: authorPage },
    })

    // Call the API with the constructed URL.
    fetch(authorsUrl).then((res) => {
      // Get the JSON data from the response.
      res.json().then((data: AuthorsApiResponse) => {
        // Display the authors in the authors filter section
        setAuthors(data.results)
        // Store the current page number for `back` and `next` purposes
        setAuthorPage(data.page)
        // Send the authors' info objects to the cache.
        cacheAuthors(data.results)
        // Update total page number
        setAuthorPages(data.totalPages)
      })
    })
    // Execute this effect on-load and every time the authorPage changes
  }, [authorPage])

  // Get a list of available tags from the API
  useEffect(() => {
    if (!tags) {
      // Generate a URL for the request
      const tagsUrl = getConfiguredRequestUrl({ type: 'tags' })

      // Call the API with the generated URL
      fetch(tagsUrl).then((res) => {
        res.json().then((data: TagResponse) => {
          // Generate a random color for each tags
          const colors = data.map((tag) => {
            return { tag: tag.name, color: getRandomColor() }
          })
          // Display the tags
          setTags(data)
          // Set the tag colors in state
          setTagColors(colors)
        })
      })
    }
    // Execute only once when the component loads.
  }, [])

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
    <div
      style={{
        display: 'flex',
        flex: 1,
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px 10px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 5,
        }}
      >
        {tags ? (
          tagsVisible ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  justifyContent: 'center',
                }}
              >
                <button onClick={hideTags}>Hide Tags</button>
              </div>
              <div
                style={{
                  display: 'grid',
                  gap: 5,
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  justifyContent: 'center',
                }}
              >
                {tags.map((tag) => {
                  const active = Boolean(tagFilters?.includes(tag.name))
                  return (
                    <button
                      style={{
                        ...(active ? { backgroundColor: selectedColor } : {}),
                        cursor: 'pointer',
                      }}
                      key={`tagButton${tag._id}`}
                      onClick={() => toggleFilter('tag', tag.name)}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <button onClick={showTags}>Show Tags</button>
            </div>
          )
        ) : null}
        {authors ? (
          authorsVisible ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  justifyContent: 'center',
                }}
              >
                <button onClick={hideAuthors}>Hide Authors</button>
              </div>
              <div
                style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
              >
                <button onClick={pageBack}>{'<'}</button>
                <button>{authorPage}</button>
                <button onClick={pageForward}>{'>'}</button>
              </div>
              <div
                style={{
                  display: 'grid',
                  gap: 5,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  justifyContent: 'center',
                }}
              >
                {authors.map((author) => {
                  const active = Boolean(authorFilters?.includes(author.name))
                  return (
                    <button
                      style={{
                        ...(active ? { backgroundColor: selectedColor } : {}),
                        cursor: 'pointer',
                      }}
                      key={`tagButton${author._id}`}
                      onClick={() => toggleFilter('author', author.name)}
                    >
                      {author.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <button onClick={showAuthors}>Show Authors</button>
            </div>
          )
        ) : null}
        <FiltersSection
          filters={filters}
          filtersVisible={filtersVisible}
          showFilters={showFilters}
          hideFilters={hideFilters}
          authorFilters={authorFilters}
          tagFilters={tagFilters}
          toggleFilter={toggleFilter}
        />
      </div>
      <Quotes quotes={quotes} toggleFilter={toggleFilter} />
    </div>
  )
}
//#endregion
export default App
