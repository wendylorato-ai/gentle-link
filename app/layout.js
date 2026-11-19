import "./globals.css";

export const metadata = {
  title: "Gentle link",
  description: "Gentle link"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
