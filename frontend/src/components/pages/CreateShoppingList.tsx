/**
 * This component allows users to create a shopping list.
 * It fetches product data from the backend API and allows users to add products to their list.
 * 
 * @component CreateShoppingList
 * @author Beatriz Sanssi
 */

import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../utils/apiFetch'
import SearchProducts from './SearchProducts'
import coupleWritingList from '../../images/CoupleWritingList.png'

interface Product {
  _id: string
  product_name: string
}

interface ShoppingItem extends Product {
  quantity: number
  unit: string
}

/**
 * CreateShoppingList component
 * This component allows users to create a shopping list.
 */
export default function CreateShoppingList() {
  // const listId = ""
  const [listName, setListName] = useState<string>("");
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>("st");
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3

  // Pagination logic
  const paginatedItems = shoppingList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  /**
   * Handles the selection of a product from the search results.
   * 
   * @param {Product} product - The selected product
   * @returns {void}
   */
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  }

  /**
   * Handles the addition of a product to the shopping list.
   * It checks if the product is already in the list and adds it if not.
   *
   * @returns {void}
   */
  const handleAddProduct = () => {
    if (!selectedProduct || !quantity || !unit) return;

    const alreadyAdded = shoppingList.find(p => p._id === selectedProduct._id);
    if (alreadyAdded) {
      alert("Product already added");
      return;
    }

    const newItem: ShoppingItem = {
      ...selectedProduct,
      quantity,
      unit
    }

    setShoppingList(prev => [...prev, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
    setUnit("");
  }

  /**
   * Handles the removal of a product from the shopping list.
   *
   * @param {string} productId - The ID of the product to be removed
   * @returns {void}
   */
  const handleRemoveProduct = (productId: string) => {
    setShoppingList(prev => prev.filter(item => item._id !== productId));
  }

  /**
   * Handles the saving of the shopping list.
   * It sends a POST request to the backend API to save the list.
   *
   * @returns {Promise<void>}
   */
  const handleSaveList = async () => {
    const token = localStorage.getItem('token')
    const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/shoppinglists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: listName, items: shoppingList, date: new Date().toISOString() })
    });

    if (res.ok) alert("List saved!");
    else alert("Could not save list.");
  }


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>New shopping list</h1>
      </div>
      <div style={styles.createContainer}>
        <div style={{ flex: 1, maxWidth: '45%', display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '60vh' }}>
        {/* <input
            type="text"
            placeholder="Name your list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            style={styles.input}
          /> */}

          <SearchProducts
            onProductSelect={handleProductSelect}
            maxResults={3}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />  

          {selectedProduct && (
            <div style={styles.formContainer}>
              <h3>{selectedProduct.product_name}</h3>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Quantity"
                style={styles.input}
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={styles.input}>
                <option value="st">st</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
              </select>
              <button onClick={handleAddProduct} style={styles.button}>Add to list</button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, maxWidth: '45%', display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Name your list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            style={styles.input}
          />
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <h2>{listName}</h2>
            <p>{new Date().toLocaleDateString()}</p>
          </div>

          <div style={styles.shoppingList}>
            {paginatedItems.map((item) => (
              <div key={item._id} style={styles.card}>
                <p><strong>{item.product_name}</strong></p>
                <p>{item.quantity} {item.unit}</p>
                <button
                  onClick={() => handleRemoveProduct(item._id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))}

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                style={styles.paginationBtn}
              >
                ⬅️ Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    (prev + 1) * itemsPerPage < shoppingList.length ? prev + 1 : prev
                  )
                }
                disabled={(currentPage + 1) * itemsPerPage >= shoppingList.length}
                style={styles.paginationBtn}
              >
                Next ➡️
              </button>
            </div>
          </div>

          <button onClick={handleSaveList} style={{ ...styles.button, marginTop: '30px' }}>
            Save List
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    textAlign: "center",
    backgroundColor: "#b0c4de",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    maxWidth: "100%",
    width: "100vw",
    height: '100vh',
    backgroundImage: `url(${coupleWritingList})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontColor: '#696969',
    position: "relative",
    padding: "20px",
  },
  header: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: "50px",
    left: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "0px 10px 30px",
    margin: '20px',
    fontSize: "15px",
    fontWeight: "bold",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    opacity: 0.8,
    width: "40%",
    height: "100%",
    maxHeight: "80px",
    borderRadius: "10px",
    color: '#696969',
    // fontFamily: "'Poppins', sans-serif",
    // width: "100%",
    // height: "100%",
    // maxHeight: "80px",
    // top: "10px",
    // left: "0px",
    // right: "10px",
    // position: "absolute",
    // backgroundColor: "rgba(255, 255, 255, 0.7)",
    // paddingTop: "0px",
    // borderRadius: "10px",
    // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    // padding: "15px 30px",
    // fontSize: "24px",
    // fontWeight: "bold",
    // opacity: 0.8,
  },
  createContainer: {
    gap: "20px",

    fontFamily: "'Poppins', sans-serif",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "10px",
    maxWidth: "1000px",
    marginTop: "100px",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    fontColor: '#2f4f4f',
  },
  input: {
    maxWidth: "100%",
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
  },
  listItem: {
    maxWidth: "100%",
    width: "400px",
    fontSize: "16px",
    textAlign: "left",
    padding: "10px",
    margin: "10px",
  },
  button: {
    width: "100%",
    maxWidth: "150px",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#556b2f",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
    overflowY: "auto",
    fontColor: '#2f4f4f',
  },
  shoppingList: {
    backgroundColor: "#dcdcdc",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    color: '#2f4f4f',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    marginBottom: "15px",
    textAlign: "left",
    fontColor: '#2f4f4f',
  },
  removeBtn: {
    backgroundColor: "#b22222",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  paginationBtn: {
    margin: "5px",
    padding: "6px 10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4682b4",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  }
} as const

