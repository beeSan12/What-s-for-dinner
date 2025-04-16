/**
 * This component allows users to create a shopping list.
 * It fetches product data from the backend API and allows users to add products to their list.
 * 
 * @component CreateShoppingList
 * @author Beatriz Sanssi
 */

import SearchProducts from './SearchProducts'

/**
 * CreateShoppingList component
 * This component allows users to create a shopping list.
 */
export default function CreateShoppingList() {
  const listId = ""

  /**
   * Handles the selection of a product from the search results.
   * If the product is custom, it sends a POST request to save it to the database.
   * Otherwise, it adds the product to the shopping list.
   * 
   * @param {Object} product - The selected product object
   * @param {string} product.product_name - The name of the product
   * @param {string} product._id - The ID of the product
   * @returns {Promise<void>} - A promise that resolves when the product is added to the list
   */
  async function handleProductSelect(product: { product_name: any; _id: any }) {
    if ('custom' in product) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/custom`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_name: product.product_name })
        })

        if (res.ok) {
          const saved = await res.json()
          alert(`“${saved.product_name}” was added to the database.`)
        } else {
          alert('Could not save product.')
        }
      } catch (err) {
        console.error(err)
        alert('Error adding product to database.')
      }
    } else {
      // Add the product to the shopping list
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/shoppinglists/${listId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      })

      alert('Product added to list!')
    }
  }

  return (
    <div>
      <h1>My Shopping List</h1>
      {/* <SearchProducts /> */}
      <SearchProducts onProductSelect={handleProductSelect} />
    </div>
  )
}