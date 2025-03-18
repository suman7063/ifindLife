
/**
 * Utility functions for standardized data format conversion between database and UI
 */

/**
 * Converts an object with snake_case keys to camelCase keys
 */
export function snakeToCamel<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object' || obj === null) return obj;
  
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from snake_case to camelCase
    const camelKey = key.replace(/([-_][a-z])/g, group => 
      group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );
    
    // Handle nested objects and arrays
    const value = obj[key];
    if (Array.isArray(value)) {
      result[camelKey] = value.map(item => 
        typeof item === 'object' && item !== null ? snakeToCamel(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[camelKey] = snakeToCamel(value);
    } else {
      result[camelKey] = value;
    }
  });
  
  return result;
}

/**
 * Converts an object with camelCase keys to snake_case keys
 */
export function camelToSnake<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object' || obj === null) return obj;
  
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Handle nested objects and arrays
    const value = obj[key];
    if (Array.isArray(value)) {
      result[snakeKey] = value.map(item => 
        typeof item === 'object' && item !== null ? camelToSnake(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[snakeKey] = camelToSnake(value);
    } else {
      result[snakeKey] = value;
    }
  });
  
  return result;
}

/**
 * Creates a standardized adapter function for converting between database and UI formats
 */
export function createAdapter<DbType, UiType>(
  dbToUiTransform?: (dbData: DbType) => UiType,
  uiToDbTransform?: (uiData: UiType) => DbType
) {
  return {
    toUi: (dbData: DbType): UiType => {
      if (dbToUiTransform) {
        return dbToUiTransform(dbData);
      }
      return snakeToCamel(dbData as unknown as Record<string, any>) as unknown as UiType;
    },
    toDb: (uiData: UiType): DbType => {
      if (uiToDbTransform) {
        return uiToDbTransform(uiData);
      }
      return camelToSnake(uiData as unknown as Record<string, any>) as unknown as DbType;
    },
    toUiList: (dbDataList: DbType[]): UiType[] => {
      return dbDataList.map(item => 
        dbToUiTransform ? dbToUiTransform(item) : snakeToCamel(item as unknown as Record<string, any>) as unknown as UiType
      );
    },
    toDbList: (uiDataList: UiType[]): DbType[] => {
      return uiDataList.map(item => 
        uiToDbTransform ? uiToDbTransform(item) : camelToSnake(item as unknown as Record<string, any>) as unknown as DbType
      );
    }
  };
}
