import "./globals.css";
import "./transaction-tags.css";
import { AppShell } from "./AppShell";
export const metadata = { title: "Money Analysis", description: "Personal money tracking" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="es"><body><AppShell>{children}</AppShell></body></html>; }
