import {NextResponse} from "next/server";

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
