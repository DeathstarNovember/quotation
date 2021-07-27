import React, { useEffect, useState } from "react"
import { getConfiguredRequestUrl, getRandomColor, selectedColor } from "../App"
import { Tag, TagResponse, ToggleFilterFunction } from "../types"

export const TagSection = ({ tagFilters, toggleFilter} : {tagFilters?:string[], toggleFilter: ToggleFilterFunction}) => {
  const [tags, setTags] = useState<Tag[] | undefined>(undefined)
  
  const [tagsVisible, setTagsVisible] = useState(false)

  const [tagColors, setTagColors] = useState<{ tag: string; color: string }[]>(
    [],
  )

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
  return tags ? (
  tagsVisible ? (
    <div
      style={{ //--- inside tag section
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 5,
      }}
    >
      <div
        style={{ //-- Hide tags title line
          display: 'grid',
          justifyContent: 'center',
        }}
      >
        <button onClick={hideTags}>Hide Tags</button>
      </div>
      <div
        style={{ //--- inside tag section
          display: 'grid',
          gap: 5,
          gridTemplateColumns: 'repeat(2, 1fr)',
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
      style={{ //--- show tags title line
        display: 'grid',
        // justifyContent: 'center',
      }}
    >
      <button onClick={showTags}>Show Tags</button>
    </div>
  )
) : null}
