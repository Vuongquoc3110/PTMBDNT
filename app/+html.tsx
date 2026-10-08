// Web Root HTML Template for Expo Router
import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* Important: Disable referrer header so external CDNs (Amazon, etc.) don't block image hotlinking */}
        <meta name="referrer" content="no-referrer" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Triệt tiêu hoàn toàn viền đen thô kệch mặc định của browser khi focus input */
              input, textarea, select, [contenteditable] {
                outline: none !important;
                outline-width: 0 !important;
                outline-style: none !important;
                box-shadow: none !important;
                -webkit-tap-highlight-color: transparent !important;
              }
              *:focus {
                outline: none !important;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
