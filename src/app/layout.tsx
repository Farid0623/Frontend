import MainMenu from "@/components/MainMenu";

export default function RootLayout({ children }) {
    return (
        <html lang="es">
        <body>
        <MainMenu />
        {children}
        </body>
        </html>
    );
}