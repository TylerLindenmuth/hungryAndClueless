// Place this file in: src/app/components/Path.ts

const app_name = 'your-domain.com'; // TODO: replace with your actual domain

export function buildPath(route: string): string {
  if (import.meta.env.MODE !== 'development') {
    return 'http://' + app_name + ':5000/' + route;
  } else {
    return 'http://localhost:5000/' + route;
  }
}
