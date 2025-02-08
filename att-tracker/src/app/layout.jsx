"use client";
import "./globals.css";
import "react-calendar/dist/Calendar.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
