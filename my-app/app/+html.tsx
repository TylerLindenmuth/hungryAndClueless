import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Web-only. Configures the root HTML for every page during static rendering.
// Does NOT run in native environments.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Makes ScrollView behave consistently with native */}
        <ScrollViewStyleReset />
        {/* Prevents background flicker on dark mode */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #F9FAFB;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #111827;
  }
}`;