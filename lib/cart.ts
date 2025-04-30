// Types for cart items
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

// Get cart items from localStorage
export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return []

  const cartData = localStorage.getItem("cart")
  return cartData ? JSON.parse(cartData) : []
}

// Add item to cart
export function addToCart(item: CartItem): void {
  const cart = getCartItems()

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id)

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += item.quantity
  } else {
    // Add new item
    cart.push(item)
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Dispatch custom event to notify components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart-updated"))
  }
}

// Update cart item quantity
export function updateCartItemQuantity(id: string, quantity: number): void {
  const cart = getCartItems()
  const itemIndex = cart.findIndex((item) => item.id === id)

  if (itemIndex >= 0) {
    cart[itemIndex].quantity = quantity
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch custom event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart-updated"))
    }
  }
}

// Remove item from cart
export function removeFromCart(id: string): void {
  const cart = getCartItems()
  const updatedCart = cart.filter((item) => item.id !== id)

  localStorage.setItem("cart", JSON.stringify(updatedCart))

  // Dispatch custom event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart-updated"))
  }
}

// Get cart items count
export function getCartItemsCount(): number {
  return getCartItems().reduce((count, item) => count + item.quantity, 0)
}
