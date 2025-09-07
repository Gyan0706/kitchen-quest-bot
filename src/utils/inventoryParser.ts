// Simple parser to extract food items from natural language
export const parseInventoryItems = (message: string): string[] => {
  const commonFoodItems = [
    'onion', 'onions', 'carrot', 'carrots', 'tomato', 'tomatoes', 'potato', 'potatoes',
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'lemon', 'lemons',
    'garlic', 'ginger', 'bell pepper', 'peppers', 'cucumber', 'cucumbers',
    'lettuce', 'spinach', 'broccoli', 'cauliflower', 'corn', 'peas',
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'eggs', 'milk',
    'cheese', 'butter', 'yogurt', 'bread', 'rice', 'pasta', 'flour',
    'oil', 'olive oil', 'salt', 'pepper', 'sugar', 'honey'
  ];

  const words = message.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 1); // Remove single characters

  let foundItems: string[] = [];
  
  // Look for exact matches with common food items
  for (const word of words) {
    if (commonFoodItems.includes(word) && !foundItems.includes(word)) {
      foundItems.push(word);
    }
  }

  // Handle compound words (like "bell pepper")
  for (let i = 0; i < words.length - 1; i++) {
    const compound = `${words[i]} ${words[i + 1]}`;
    if (commonFoodItems.includes(compound) && !foundItems.includes(compound)) {
      foundItems.push(compound);
      // Remove individual words if compound was found
      foundItems = foundItems.filter(item => item !== words[i] && item !== words[i + 1]);
    }
  }

  return foundItems;
};

// Check if message is about adding items to inventory
export const isAddToInventoryMessage = (message: string): boolean => {
  const addKeywords = ['add', 'put', 'store', 'save', 'include', 'insert'];
  const inventoryKeywords = ['inventory', 'pantry', 'storage', 'fridge', 'kitchen'];
  
  const lowerMessage = message.toLowerCase();
  
  const hasAddKeyword = addKeywords.some(keyword => lowerMessage.includes(keyword));
  const hasInventoryKeyword = inventoryKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Also check for prepositions that suggest adding
  const hasIntoPhrase = lowerMessage.includes('into my') || lowerMessage.includes('to my');
  
  return (hasAddKeyword && hasInventoryKeyword) || hasIntoPhrase;
};