import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'forkliftplus_cart'

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  const addItem = (product) => {
    const id = product.id || `${product.name}-${product.price}`
    setItems((current) => {
      const existing = current.find((item) => item.id === id)
      const next = existing
        ? current.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [
            ...current,
            {
              id,
              name: product.name,
              price: product.price,
              image: product.image,
              categoryLabel: product.categoryLabel,
              quantity: 1,
            },
          ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const removeItem = (id) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, quantity } : item))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearCart = () => {
    localStorage.removeItem(STORAGE_KEY)
    setItems([])
  }

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
