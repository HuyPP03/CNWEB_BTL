// Types for enhanced order page
import { ProductV2 } from '../types/product'; 
import { OrderItem } from '../types/order';

// Enhanced order item interface with full product details
export interface EnhancedOrderItem extends OrderItem {
  fullProduct?: ProductV2;
}

// Function to fetch product details for order items
export const fetchProductDetailsForOrderItems = async (orderItems: OrderItem[]): Promise<EnhancedOrderItem[]> => {
  // Import here to avoid circular dependencies
  const productService = await import('../services/product.service').then(m => m.default);
  
  const enhancedItemsPromises = orderItems.map(async (item) => {
    try {
      // Only proceed if we have a variant with productId
      if (item.productVariant && item.productVariant.productId) {
        // Fetch the full product details using the productId from the variant
        const productResponse = await productService.getProductById(item.productVariant.productId);
        
        if (productResponse.data && productResponse.data.length > 0) {
          // Return enhanced item with full product
          return {
            ...item,
            fullProduct: productResponse.data[0]
          } as EnhancedOrderItem;
        }
      }
      // Return the original item if product fetch fails
      return item as EnhancedOrderItem;
    } catch (err) {
      console.error(`Error fetching product for item ${item.id}:`, err);
      return item as EnhancedOrderItem;
    }
  });

  // Wait for all item enhancement promises to resolve
  return Promise.all(enhancedItemsPromises);
};
