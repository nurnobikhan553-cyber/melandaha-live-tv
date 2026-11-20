import "./globals.css";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Melandaha Live TV",description:"Watch authorized live TV streams"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="bn"><body>{children}</body></html>}