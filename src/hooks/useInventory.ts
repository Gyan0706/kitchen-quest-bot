import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  expiry_date?: string;
  created_at: string;
  user_id?: string;
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemName: string, quantity: number = 1, expiryDate?: string) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          item_name: itemName,
          quantity,
          expiry_date: expiryDate,
          user_id: 'default_user' // Will be replaced with auth.uid() when auth is implemented
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data, ...prev]);
      
      toast({
        title: "Item Added",
        description: `${itemName} (${quantity}) added to inventory`,
      });

      return data;
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addMultipleItems = async (itemNames: string[]) => {
    try {
      const promises = itemNames.map(itemName => 
        addItem(itemName.trim().toLowerCase(), 1)
      );
      
      const results = await Promise.all(promises);
      
      toast({
        title: "Items Added",
        description: `Added ${itemNames.length} items to your inventory`,
      });
      
      return results;
    } catch (error) {
      console.error('Error adding multiple items:', error);
      throw error;
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item Removed",
        description: "Item removed from inventory",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
      
      toast({
        title: "Quantity Updated",
        description: "Item quantity updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    addMultipleItems,
    removeItem,
    updateQuantity,
    fetchItems
  };
};