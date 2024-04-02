export function objectToString(object) {
  if (object === undefined || object === null) {
    return 'undefined or null';
  } 
  const isObject = (val) => val && typeof val === 'object';
  return Object.entries(object)
  .map(([key, value]) => {
    // Check if the value is an object and not an array
    if (isObject(value) && !Array.isArray(value)) {
      // Recursively convert nested objects to string
      return `${key}: { ${objectToString(value)} }`;
    } else if (Array.isArray(value)) {
      // Convert array values, including nested objects within the array
      return `${key}: [ ${value.map(val => isObject(val) ? `{ ${objectToString(val)} }` : `'${val}'`).join(", ")} ]`;
    } else {
      // Convert non-object values to string
      return `${key}: '${value}'`;
    }
  })
  .join(", ");
}
