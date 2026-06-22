import { create } from 'zustand';


interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number) => void; // <-- 1. Добавили тип новой функции
  clearCart: () => void;
}
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number; // <-- Добавили!
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

 addItem: (newItem) => set((state) => {
    const existingItem = state.items.find(i => i.productId === newItem.productId);
    
    if (existingItem) {
      // 👇 Если количество в корзине уже равно или больше остатка на складе — игнорируем клик!
      if (existingItem.quantity >= newItem.stock) {
        return state; 
      }
      return {
        items: state.items.map(i => 
          i.productId === newItem.productId 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        )
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),

  // 👇 2. Реализуем саму функцию убавления/удаления
  removeItem: (productId) => set((state) => {
    const existingItem = state.items.find(i => i.productId === productId);
    
    // Если товара больше 1 штуки — просто уменьшаем количество на 1
    if (existingItem && existingItem.quantity > 1) {
      return {
        items: state.items.map(i => 
          i.productId === productId 
            ? { ...i, quantity: i.quantity - 1 } 
            : i
        )
      };
    }
    
    // Если осталась 1 штука — полностью отфильтровываем (удаляем) товар из массива
    return {
      items: state.items.filter(i => i.productId !== productId)
    };
  }),

  clearCart: () => set({ items: [] }),
}));