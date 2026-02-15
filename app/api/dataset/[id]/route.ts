import { NextResponse } from "next/server";

// Mock responses for individual dataset operations
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await new Promise((r) => setTimeout(r, 300));

  return NextResponse.json({
    id,
    imageUrl:
      "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=400&h=400&fit=crop",
    label: "Amanita muscaria",
    confidence: 0.92,
    status: "labeled",
    createdAt: new Date().toISOString(),
    top: [
      { label: "Amanita muscaria", confidence: 0.92 },
      { label: "Amanita pantherina", confidence: 0.05 },
      { label: "Agaricus bisporus", confidence: 0.02 },
    ],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  await new Promise((r) => setTimeout(r, 300));

  return NextResponse.json({
    id,
    imageUrl:
      "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=400&h=400&fit=crop",
    label: body.label ?? "Amanita muscaria",
    confidence: 0.92,
    status: body.status ?? "labeled",
    createdAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  await new Promise((r) => setTimeout(r, 300));
  return new NextResponse(null, { status: 204 });
}
