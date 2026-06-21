import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "../components/shared/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: { default: "UpLink — Find Your Next Opportunity", template: "%s — UpLink" },
  description: "UpLink connects talented professionals with great companies.",
  icons: {
    icon: "/uplink_logo_no_bg.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
