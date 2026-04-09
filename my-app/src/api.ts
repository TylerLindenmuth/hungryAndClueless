const BASE_URL = 'http://www.hungryandclueless.xyz:5000';
 
export function buildPath(route: string): string {
  return `${BASE_URL}/${route}`;
}