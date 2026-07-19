/**
 * Checks if an attribute is built-in
 * @param info - The atttribute info
 * @returns - True if it's a built-in attribute
 */
export function isBuiltIn(info: WebGLActiveInfo) {
  const name = info.name;
  return name.startsWith("gl_") || name.startsWith("webgl_");
}
