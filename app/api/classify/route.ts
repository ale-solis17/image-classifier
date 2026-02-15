import { NextResponse } from "next/server";

const MOCK_LABELS = [
  "Amanita muscaria",
  "Boletus edulis",
  "Cantharellus cibarius",
  "Morchella esculenta",
  "Agaricus bisporus",
  "Lactarius deliciosus",
  "Pleurotus ostreatus",
  "Tuber melanosporum",
];

function randomConfidence() {
  return Math.round((0.5 + Math.random() * 0.5) * 1000) / 1000;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const mainIdx = Math.floor(Math.random() * MOCK_LABELS.length);
    const mainConfidence = randomConfidence();

    // Generate top 3
    const otherIndices = MOCK_LABELS.map((_, i) => i)
      .filter((i) => i !== mainIdx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const top = [
      { label: MOCK_LABELS[mainIdx], confidence: mainConfidence },
      ...otherIndices.map((i) => ({
        label: MOCK_LABELS[i],
        confidence: Math.round(Math.random() * mainConfidence * 0.6 * 1000) / 1000,
      })),
    ].sort((a, b) => b.confidence - a.confidence);

    return NextResponse.json({
      label: MOCK_LABELS[mainIdx],
      confidence: mainConfidence,
      top,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
