import {NextResponse} from "next/server";

<<<<<<< HEAD
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // reenviar al backend FastAPI
    const backendForm = new FormData();
    backendForm.append("file", image);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/classify`,
      {
        method: "POST",
        body: backendForm,
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Backend connection error" },
      { status: 500 }
    );
  }
}
=======
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
                {error: "No image file provided"},
                {status: 400}
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
            {label: MOCK_LABELS[mainIdx], confidence: mainConfidence},
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
            {error: "Internal server error"},
            {status: 500}
        );
    }
}
>>>>>>> 2296f3a867f94eb3d5957cf481ec557c8ebcf5d6
