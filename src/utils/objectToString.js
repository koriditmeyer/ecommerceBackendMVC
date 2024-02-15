export function objectToString(object) {
  if (object === undefined || object === null) {
    return 'undefined or null';
  } 
  return Object.entries(object)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(", ");
}
