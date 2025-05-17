// Helper functions for working with localStorage

const PREFIX = "gem-n-eyes-"

// Function to serialize dates in JSON
function replacer(key: string, value: any) {
  if (value instanceof Date) {
    return { __type: "Date", value: value.toISOString() }
  }
  return value
}

// Function to deserialize dates from JSON
function reviver(key: string, value: any) {
  if (typeof value === "object" && value !== null && value.__type === "Date") {
    return new Date(value.value)
  }
  return value
}

// Get item from localStorage with proper parsing
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`)
    if (!item) return null
    return JSON.parse(item, reviver) as T
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error)
    return null
  }
}

// Set item in localStorage with proper serialization
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value, replacer))
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error)
  }
}

// Remove item from localStorage
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${key}`)
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error)
  }
}

// Clear all items with the prefix from localStorage
export function clearItems(): void {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error clearing items from localStorage:", error)
  }
}
