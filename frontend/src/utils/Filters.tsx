/**
 * Filters component for selecting eco scores and excluding allergens.
 *
 * @component Filters
 * @author Beatriz Sanssi
 */

import React from 'react'

interface FiltersProps {
  ecoScoreFilter: string[]
  setEcoScoreFilter: React.Dispatch<React.SetStateAction<string[]>>
  excludedAllergens: string[]
  setExcludedAllergens: React.Dispatch<React.SetStateAction<string[]>>
}

const ALL_ECO_SCORES = ['A', 'B', 'C', 'D', 'E']
const COMMON_ALLERGENS = ['gluten', 'soy', 'nuts', 'peanuts', 'eggs', 'lactose', 'shellfish', 'fish']

export const Filters: React.FC<FiltersProps> = ({
  ecoScoreFilter,
  setEcoScoreFilter,
  excludedAllergens,
  setExcludedAllergens,
}) => {
  const handleEcoScoreChange = (score: string, checked: boolean) => {
    setEcoScoreFilter(prev =>
      checked ? [...prev, score] : prev.filter(s => s !== score)
    )
  }

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    setExcludedAllergens(prev =>
      checked ? [...prev, allergen] : prev.filter(a => a !== allergen)
    )
  }

  return (
    <div style={styles.filterBox}>
      <h4 style={styles.sectionTitle}>Filters</h4>

      <div style={styles.filterGroup}>
        <span style={styles.filterLabel}>Eco Score:</span>
        {ALL_ECO_SCORES.map(score => (
          <label key={score} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={ecoScoreFilter.includes(score)}
              onChange={e => handleEcoScoreChange(score, e.target.checked)}
            />
            {score}
          </label>
        ))}
      </div>

      <div style={styles.filterGroup}>
        <span style={styles.filterLabel}>Exclude Allergens:</span>
        {COMMON_ALLERGENS.map(allergen => (
          <label key={allergen} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={excludedAllergens.includes(allergen)}
              onChange={e => handleAllergenChange(allergen, e.target.checked)}
            />
            {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
          </label>
        ))}
      </div>
    </div>
  )
}

const styles = {
  filterBox: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#f2f2f2',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 100,
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#2f4f4f',
  },
  filterGroup: {
    marginBottom: '1rem',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginRight: '1rem',
    color: '#2f4f4f',
  },
  checkboxLabel: {
    marginRight: '0.75rem',
    color: '#2f4f4f',
  },
} as const