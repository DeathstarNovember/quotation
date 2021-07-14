import React, { useEffect, useState } from "react";
import { Author, AuthorsApiResponse, getConfiguredRequestUrl, selectedColor, ToggleFilterFunction } from "../App";

export const AuthorSection = ({ cacheAuthors, authorFilters, toggleFilter}: {
    cacheAuthors: (newAuthors: Author[]) => void
    authorFilters?: string[], 
    toggleFilter: ToggleFilterFunction, 
    }) => {
      const [authors, setAuthors] = useState<Author[] | undefined>(undefined)
      const [authorPage, setAuthorPage] = useState<number>(1)   // Author Pagination
      const [authorPages, setAuthorPages] = useState<number>(1)
      const [authorsVisible, setAuthorsVisible] = useState(false)
  /**
   * Hide author filter section
   */
      const hideAuthors = () => {
    setAuthorsVisible(false)
  }

  /**
   * Show author filter section
   */
    const showAuthors = () => {
    setAuthorsVisible(true)
  }

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
    }, [authorPage, cacheAuthors])

    return authors ? (
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
    ) : null
  }