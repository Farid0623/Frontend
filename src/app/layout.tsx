import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body>
        <Header />
        <main className="main-bg">{children}</main>
        </body>
        </html>
    );
}