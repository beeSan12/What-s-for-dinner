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
import SearchProducts from '../types/SearchProducts'
import coupleWritingList from '../../images/CoupleWritingList.png'
import { FaRegEdit } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

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
  const [listName, setListName] = useState<string>('')
  const [editingName, setEditingName] = useState<boolean>(true)
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  // const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [unit, setUnit] = useState<string>('st')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3

  // Pagination logic
  const paginatedItems = shoppingList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  )

  /**
   * Handles the selection of a product from the search results.
   *
   * @param {Product} product - The selected product
   * @returns {void}
   */
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)
    setUnit('st')
  }
  //   const newItem: ShoppingItem = {
  //     ...product,
  //     quantity: 1,
  //     unit: 'st',
  //   }
  //   setShoppingList(prev => [...prev, newItem])
  //   // setSelectedProduct(product)
  // }

  /**
   * Handles the addition of a product to the shopping list.
   * It checks if the product is already in the list and adds it if not.
   *
   * @returns {void}
   */
  const handleAddProduct = () => {
    if (!selectedProduct || !quantity || !unit) return

    const alreadyAdded = shoppingList.find((p) => p._id === selectedProduct._id)
    if (alreadyAdded) {
      alert('Product already added')
      return
    }

    const newItem: ShoppingItem = {
      ...selectedProduct,
      quantity,
      unit,
    }

    setShoppingList((prev) => [...prev, newItem])
    setSelectedProduct(null)
    setQuantity(1)
    setUnit('')
  }

  /**
   * Handles the removal of a product from the shopping list.
   *
   * @param {string} productId - The ID of the product to be removed
   * @returns {void}
   */
  const handleRemoveProduct = (productId: string) => {
    setShoppingList((prev) => prev.filter((item) => item._id !== productId))
  }

  /**
   * Handles the saving of the shopping list.
   * It sends a POST request to the backend API to save the list.
   *
   * @returns {Promise<void>}
   */
  const handleSaveList = async () => {
    if (!listName.trim()) {
      alert('Please enter a list name.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/shoppinglist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: listName,
            items: shoppingList,
            date: new Date().toISOString(),
          })
        })
  
        if (res.ok) {
          alert('List saved successfully!')
          setListName('')
          setShoppingList([])
          setSelectedProduct(null)
        } else {
          alert('Failed to save the list.')
        }
      } catch (error) {
        console.error('Error saving list:', error)
        alert('Error saving list.')
      }
    }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>New shopping list</h1>
      </div>
      <div style={styles.createContainer}>
        <div style={styles.leftColumn}>
          {/* <input
            type="text"
            placeholder="Name your list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            style={styles.input}
          /> */}
          <div style={styles.headerDiv}>
            <p>Search Products</p>
          </div>
          <SearchProducts
            // onResults={setProducts}
            onProductSelect={handleProductSelect}
            maxResults={3}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            minimalLayout={true}
            showSelectButton={true}
            customInputStyle={styles.searchInput}
            customButtonStyle={styles.searchButton}
          />

          {/* {products.map((product) => (
            <div key={product._id} style={{ marginTop: '10px' }}>
              <p><strong>{product.product_name}</strong></p>
              <button onClick={() => handleProductSelect(product)} style={styles.button}>
                Select
              </button>
            </div>
          ))} */}

          {selectedProduct && (
             <div style={styles.overlay} onClick={() => setSelectedProduct(null)}>
             <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
               <button
                 onClick={() => setSelectedProduct(null)}
                 style={styles.closeButton}
               >
                 <MdClose />
               </button>
               <h2 style={styles.modalTitle}>{selectedProduct.product_name}</h2>
               <input
                 type="number"
                 min="1"
                 value={quantity}
                 onChange={(e) => setQuantity(Number(e.target.value))}
                 placeholder="Quantity"
                 style={styles.input}
               />
               <select
                 value={unit}
                 onChange={(e) => setUnit(e.target.value)}
                 style={styles.input}
               >
                 <option value="st">st</option>
                 <option value="g">g</option>
                 <option value="kg">kg</option>
                 <option value="ml">ml</option>
                 <option value="l">l</option>
               </select>
               <button
                 onClick={() => {
                   handleAddProduct()
                   setSelectedProduct(null) // Stäng efter att ha lagt till
                 }}
                 style={styles.button}
               >
                 Add to list
               </button>
             </div>
           </div>
         )}
          {/* //   <div style={styles.formContainer}>
          //     <p>{selectedProduct.product_name}</p>
          //     <input */}
          {/* //       type="number"
          //       min="1"
          //       value={quantity}
          //       onChange={(e) => setQuantity(Number(e.target.value))}
          //       placeholder="Quantity"
          //       style={styles.input}
          //     />
          //     <select
          //       value={unit}
          //       onChange={(e) => setUnit(e.target.value)}
          //       style={styles.input}
          //     >
          //       <option value="st">st</option>
          //       <option value="g">g</option>
          //       <option value="kg">kg</option>
          //       <option value="ml">ml</option>
          //       <option value="l">l</option>
          //     </select>
          //     <button onClick={handleAddProduct} style={styles.button}>
          //       Add to list
          //     </button>
          //   </div>
          // )} */}
        </div>

        <div style={styles.rightColumn}>
        {editingName ? (
            <div style={styles.nameInputContainer}>
              <input
                type="text"
                placeholder="Name your list"
                value={listName}
                onChange={e => setListName(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={() => {
                  if (listName.trim() === '') {
                    alert('Please enter a name.')
                    return
                  }
                  setEditingName(false)
                }}
                style={styles.button}
              >
                Save name
              </button>
            </div>
          ) : (
            <div style={styles.nameDisplayContainer}>
              <h2 style={styles.listNameHeading}>{listName}</h2>
              <button
                onClick={() => setEditingName(true)}
                style={styles.editNameBtn}
              >
                <FaRegEdit size={20} />
              </button>
            </div>
          )}

          <div style={styles.shoppingList}>
            {paginatedItems.map((item) => (
              <div key={item._id} style={styles.cardRow}>
              <div style={styles.itemInfo}>
                <strong>{item.product_name}</strong> — {item.quantity} {item.unit}
              </div>
              <button
                onClick={() => handleRemoveProduct(item._id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
            ))}

            {/* <div style={{ marginTop: '10px' }}>
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
                    (prev + 1) * itemsPerPage < shoppingList.length
                      ? prev + 1
                      : prev,
                  )
                }
                disabled={
                  (currentPage + 1) * itemsPerPage >= shoppingList.length
                }
                style={styles.paginationBtn}
              >
                Next ➡️
              </button>
            </div> */}
          </div>

          <button
            onClick={handleSaveList}
            style={{ ...styles.button, marginTop: '30px' }}
          >
            Save List
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center',
    backgroundColor: '#b0c4de',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    maxWidth: '100%',
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${coupleWritingList})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontColor: '#696969',
    position: 'relative',
    padding: '20px',
  },
  header: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50px',
    left: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '0px 10px 30px',
    margin: '20px',
    fontSize: '15px',
    fontWeight: 'bold',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    opacity: 0.8,
    width: '40%',
    height: '100%',
    maxHeight: '80px',
    borderRadius: '10px',
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
    gap: '20px',
    margin: '20px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '18px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '10px',
    maxWidth: '1000px',
    marginTop: '100px',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontColor: '#2f4f4f',
  },
  leftColumn: {
    flex: 1,
    maxWidth: '45%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: '60vh',
  },
  rightColumn: {
    flex: 1,
    maxWidth: '45%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerDiv: {
    color: '#2f4f4f',
    fontSize: '30px',
    fontWeight: 'bold',
  },
  nameInputContainer: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  nameDisplayContainer: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  listNameHeading: { 
    color: '#2f4f4f',
    alignConten: 'center',
    justifyContent: 'center',
  },
  editNameBtn: {
    padding: '5px 10px',
    fontSize: 14,
    cursor: 'pointer',
  },
  input: {
    maxWidth: '100%',
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    margin: '10px',
    flex: 1,
  },
  searchInput: {
    maxWidth: '100%',
    padding: '8px',
    fontSize: '16px',
    margin: '10px',
  },
  searchButton: {
    width: '100%',
    maxWidth: '100px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#2f4f4f',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
  },
  listItem: {
    maxWidth: '100%',
    width: '400px',
    fontSize: '16px',
    textAlign: 'left',
    padding: '10px',
    margin: '10px',
  },
  button: {
    width: '100%',
    maxWidth: '150px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#2f4f4f',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    minWidth: '300px',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  modalTitle: {
    marginBottom: '20px',
    color: '#2f4f4f',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  // formContainer: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.9)',
  //   borderRadius: '10px',
  //   padding: '10px',
  //   margin: '20px',
  //   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  //   maxWidth: '400px',
  //   height: '100%',
  //   width: '90%',
  //   minHeight: '200px',
  //   overflowY: 'auto',
  //   color: '#2f4f4f',
  // },
  shoppingList: {
    backgroundColor: '#dcdcdc',
    opacity: 0.9,
    borderRadius: '10px',
    padding: '0px',
    margin: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
    minHeight: '200px',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    overflowY: 'auto',
    color: '#2f4f4f',
    fontSize: '12px',
  },
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    margin: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#2f4f4f',
    maxWidth: '400px',
    width: '100%',
  },
  itemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
  },
  removeBtn: {
    backgroundColor: '#b22222',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  paginationBtn: {
    margin: '5px',
    padding: '6px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#2f4f4f',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
} as const
