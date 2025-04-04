
import { supabase } from '@/lib/supabase';

// Example function to import data into Supabase
export const importData = async (data: any, tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName as any)
      .insert(data);
      
    if (error) {
      console.error(`Error importing data to ${tableName}:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Exception importing data to ${tableName}:`, err);
    return false;
  }
};

// Function to check if a table exists
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_if_table_exists', {
      table_name: tableName
    });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error(`Exception checking if table ${tableName} exists:`, err);
    return false;
  }
};

// Function to get all records from a table
export const getAllRecords = async (tableName: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*');
      
    if (error) {
      console.error(`Error getting all records from ${tableName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error(`Exception getting all records from ${tableName}:`, err);
    return [];
  }
};
