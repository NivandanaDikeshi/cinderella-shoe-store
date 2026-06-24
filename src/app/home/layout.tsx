import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Cinderella Store",
  description: "User home page",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}