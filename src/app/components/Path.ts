// Place this file in: src/app/components/Path.ts

const app_name = 'hungryandclueless.xyz'; // TODO: replace with your actual domain

export function buildPath(route: string): string {
  if (import.meta.env.MODE !== 'development') {
    return 'https://' + app_name + '/' + route;
  } else {
    return 'http://localhost:5000/' + route;
  }
}
