import React from "react";
import { Author, selectedColor, ToggleFilterFunction } from "../App";

export const AuthorSection = ({
  authors, 
  authorsVisible, 
  hideAuthors, 
  pageBack, 
  authorPage, 
  pageForward, 
  authorFilters, 
  toggleFilter, 
  showAuthors}: {
    authors?: Author[], 
    authorsVisible: boolean, 
    hideAuthors: ()=>void, 
    pageBack: ()=>void, 
    authorPage: number, 
    pageForward: ()=>void, 
    authorFilters?: string[], 
    toggleFilter: ToggleFilterFunction, 
    showAuthors: ()=>void}) => {
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