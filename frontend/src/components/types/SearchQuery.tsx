/**
 * This component is used to ask a free text question to the model.
 *
 * @component SearchQuery
 * @author Beatriz Sanssi
 */

import { useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import guruRemove from '../../images/guru-removebg-preview.png'
import guruHeader from '../../images/guruHeader.png'
import { MdClose } from 'react-icons/md'

interface EmbeddingMatch {
  id: string
  text: string | { text: string; bold?: boolean }[]
  score: number
}

interface AskEmbeddingResponse {
  fallback?: string
  recipe?: string
  products?: EmbeddingMatch[]
}

/**
 * This component allows users to ask a free text question to the model.
 *
 * @returns {JSX.Element} The SearchQuery component.
 */
export default function SearchQuery() {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<EmbeddingMatch[]>([])

  /**
   * This function clears the results and resets the query.
   */
  const clearResults = () => {
    setResults([])
    setQuery('')
  }

  /**
   * This function sends the user's query to the API and retrieves the results.
   */
  const searchFreeQuery = async () => {
    // Check if the query is empty
    if (!query.trim()) {
      alert('Please enter a question first.')
      return
    }

    try {
      const data: AskEmbeddingResponse = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/embeddings/ask`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        },
      )

      console.log('RESPONSE:', data)
      if (data.fallback) {
        // Only show fallback if no recipe is found
        setResults([{ id: 'fallback', text: data.fallback, score: 0 }])
        return
      }

      if (Array.isArray(data.recipe)) {
        // If recipe is an array (multiple recipes)
        const formatted = data.recipe.map((r) => ({
          id: 'recipe-' + Math.random(),
          text: formatRecipeText(r),
          score: 1,
        }))
        setResults(formatted)
        return
      }

      if (data.recipe) {
        const formattedRecipe = formatRecipeText(data.recipe)
        setResults([
          {
            id: 'recipe',
            text: formattedRecipe,
            score: 1,
          },
        ])
        return
      }

      if (typeof data.recipe === 'string') {
        // If recipe is a string (one recipe)
        const formattedRecipe = formatRecipeText(data.recipe)
        setResults([
          {
            id: 'recipe',
            text: formattedRecipe,
            score: 1,
          },
        ])
        return
      }

      if (data.products && Array.isArray(data.products)) {
        setResults(data.products)
        return
      }

      alert('Unexpected response format')
    } catch (error) {
      console.error('Error while querying:', error)
      alert('Something went wrong while processing your question.')
    }
  }

  /**
   * Formats the raw recipe text to a more readable layout.
   *
   * @param {string} recipe - Raw recipe text from the API.
   * @returns {string} Formatted recipe text.
   */
  function formatRecipeText(
    recipe: string,
  ): { text: string; bold?: boolean }[] {
    return recipe
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .flatMap((line) => {
        if (
          line.toLowerCase() === 'ingredients:' ||
          line.toLowerCase() === 'instructions:'
        ) {
          return [{ text: line, bold: true }, { text: '' }]
        } else if (line.toLowerCase().startsWith("here's a simple recipe")) {
          return [{ text: line }, { text: '' }]
        } else if (line.startsWith('-')) {
          return [{ text: '• ' + line.slice(1).trim() }]
        } else if (/^\d+\./.test(line)) {
          return [{ text: '' }, { text: line }]
        } else {
          return [{ text: line }]
        }
      })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}></div>
      <div style={styles.questionBox}>
        <h2>Ask the Chef Guru a Question</h2>
        {results.length === 0 ? (
          <>
            <input
              type="text"
              placeholder="e.g. which chocolate is dairy free?"
              style={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button style={styles.button} onClick={searchFreeQuery}>
              Ask
            </button>
          </>
        ) : (
          <div style={styles.answerBox}>
            <button onClick={clearResults} style={styles.closeButton}>
              <MdClose />
            </button>
            <div style={styles.resultList}>
              {results.map((match, idx) => (
                <div key={match.id} style={styles.resultCard}>
                  {Array.isArray(match.text) ? (
                    match.text.map((line, i) =>
                      line.bold ? (
                        <div key={i} style={{ marginTop: '1.2rem' }}>
                          <strong>{line.text}</strong>
                        </div>
                      ) : (
                        <div
                          key={i}
                          style={{
                            marginTop: line.text === '' ? '1rem' : '0.2rem',
                            marginLeft: line.text.startsWith('•')
                              ? '10px'
                              : '0',
                          }}
                        >
                          {line.text}
                        </div>
                      ),
                    )
                  ) : (
                    <pre style={styles.recipeText}>{match.text}</pre>
                  )}
                  {idx < results.length - 1 && (
                    <hr
                      style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={styles.imageDiv}></div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'rgba(232, 222, 212)',
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    // padding: '20px',
    padding: '20px 10px',
    boxSizing: 'border-box',
    // margin: '20px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    // minHeight: '100%',
    // maxWidth: '100%',
    // width: '1600px',
    // height: '3000px',
    minHeight: '100%',
    maxWidth: '100%',
    width: '100vw',
    height: '100vh',
    paddingTop: '150px',
    color: '#2f4f4f',
  },
  header: {
    backgroundImage: `url(${guruHeader})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: 'rgba(251, 246, 234, 0.5)',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    // height: '100%',
    // width: '100%',
    // maxWidth: '700px',
    // maxHeight: '250px',
    width: '100%',
    maxWidth: '700px',
    height: '200px',
    opacity: 0.9,
    fontSize: '20px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDiv: {
    backgroundImage: `url(${guruRemove})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: 'rgba(232, 222, 212)',
    // maxHeight: '800px',
    // padding: '20px',
    // marginTop: '20px',
    // height: '100%',
    // width: '100%',
    // maxWidth: '800px',
    // borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
    borderRadius: '12px',
    height: '250px',
    width: '100%',
    maxWidth: '400px',
  },
  questionBox: {
    maxHeight: '300px',
    padding: '20px',
    minHeight: '300px',
    marginTop: '30px',
    height: '100%',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    maxWidth: '500px',
    width: '100%',
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    margin: '10px',
    flex: 1,
    borderRadius: '8px',
  },
  button: {
    width: '100%',
    maxWidth: '100px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(134, 154, 160)',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px',
  },
  answerBox: {
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    height: '100%',
    maxWidth: '1000px',
    minHeight: '400px',
    overflowY: 'auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    color: '#2f4f4f',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#2f4f4f',
  },
  resultList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  resultCard: {
    backgroundColor: '#fdfcfb',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  recipeText: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
    fontSize: '16px',
    color: '#2f4f4f',
    lineHeight: 1.6,
  },
} as const
