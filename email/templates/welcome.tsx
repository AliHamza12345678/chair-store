import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  storeUrl: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
  storeUrl,
}) => (
  <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    <h1 style={{ color: "#111827" }}>Welcome, {name}!</h1>
    <p>We are thrilled to have you join LUMINA. Explore our premium furniture collection today.</p>
    <a href={storeUrl} style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "#000", color: "#fff", textDecoration: "none", borderRadius: "6px", marginTop: "20px" }}>
      Shop Now
    </a>
  </div>
);
