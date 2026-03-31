// Place this file in: src/app/tokenStorage.ts

export function storeToken(token: string): void {
  try {
    localStorage.setItem('token_data', token);
  } catch (e) {
    console.log(e);
  }
}

export function retrieveToken(): string | null {
  try {
    return localStorage.getItem('token_data');
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem('token_data');
    localStorage.removeItem('user_data');
  } catch (e) {
    console.log(e);
  }
}
