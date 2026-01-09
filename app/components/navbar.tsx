"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "2rem",
      }}
    >
      <Link href="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link href="/upload" style={{ marginRight: "1rem" }}>
        Leaf Analysis
      </Link>
      <Link href="/chat">
        AI Chat
      </Link>
    </nav>
  );
}
