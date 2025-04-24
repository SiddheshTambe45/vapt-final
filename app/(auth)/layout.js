export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
