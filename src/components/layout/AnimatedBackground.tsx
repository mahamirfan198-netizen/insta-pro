"use client";

export default function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #FAF5FF 0%, #FCE7F3 40%, #E0F2FE 100%)",
        }}
      />

      {/* Purple blob — CENTER-LEFT */}
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          opacity: 0.55,
          filter: "blur(90px)",
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
        }}
      />

      {/* Pink blob — CENTER-RIGHT */}
      <div
        className="animate-blob-slow"
        style={{
          position: "absolute",
          top: "5%",
          right: "5%",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          opacity: 0.5,
          filter: "blur(90px)",
          background: "radial-gradient(circle, #EC4899 0%, transparent 70%)",
        }}
      />

      {/* Cyan blob — BOTTOM-CENTER */}
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          bottom: "5%",
          left: "35%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          opacity: 0.5,
          filter: "blur(90px)",
          background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />

      {/* Amber blob — TOP-CENTER */}
      <div
        className="animate-blob-slow"
        style={{
          position: "absolute",
          top: "-5%",
          left: "45%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          opacity: 0.4,
          filter: "blur(80px)",
          background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}