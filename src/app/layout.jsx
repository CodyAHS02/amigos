import BodyAttributes from "@/components/BodyAttributes";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata = {
  title: "Amigos Maler",
  description:
    "Painting, plastering, renovation and property value preservation services by Amigos Maler GmbH.",
  icons: {
    icon: "/assets/logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BodyAttributes />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
