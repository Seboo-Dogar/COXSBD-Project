import ScriptList from "@/components/software-script/ScriptList";
import React from "react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Category: {slug.replace("-", " ")}
      </h2>
      <ScriptList category={slug} />
    </div>
  );
}
