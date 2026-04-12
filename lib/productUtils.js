import { supabase } from './supabase';

/**
 * Update a product in the database
 * @param {number} productId - The ID of the product to update
 * @param {object} updates - Object containing fields to update
 * @returns {object} - The updated product data or null if error
 */
export async function updateProduct(productId, updates) {
  try {
    console.log('Attempting to update product:', { productId, updates });
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();

    if (error) {
      console.error('❌ Update failed:', error.message);
      console.error('Error details:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No data returned from update');
      return { success: false, error: 'No data returned' };
    }

    console.log('✅ Update successful:', data[0]);
    return { success: true, data: data[0] };
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all products
 */
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('❌ Fetch failed:', error.message);
      return { success: false, error: error.message, data: [] };
    }

    console.log(`✅ Fetched ${data?.length || 0} products`);
    return { success: true, data: data || [] };
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId) {
  try {
    console.log('Attempting to delete product:', productId);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('❌ Delete failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Delete successful');
    return { success: true };
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return { success: false, error: err.message };
  }
}
