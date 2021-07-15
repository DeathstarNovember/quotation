export type ToggleFilterFunction = (
  type: 'author' | 'tag',
  filter: string,
) => void
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
export type QuotesApiResponse = APIResponse & {
  results: Quote[]
}

/**
 * API response from the `/authors[?]` endpoint
 */
export type AuthorsApiResponse = APIResponse & {
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
export type TagResponse = Tag[]

/**
 * Tag object type
 */
export type Tag = {
  _id: string
  name: string
}

/**
 * Author object type
 */
export type Author = {
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
export type RequestConfig =
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