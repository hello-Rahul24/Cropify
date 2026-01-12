"use client";

import dynamic from "next/dynamic";

const FieldMap = dynamic(() => import("../components/FieldMap"), {
  ssr: false,
});

export default function FieldAnalysisPage() {
  return <FieldMap />;
}
