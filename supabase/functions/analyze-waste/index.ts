import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      throw new Error("No image provided");
    }

    // Optional validation (can be removed if not needed)
    if (!image.type.startsWith("image/")) {
      throw new Error("Uploaded file is not an image");
    }

    return new Response(
      JSON.stringify({
        success: true,
        wasteType: "Plastic",
        confidence: 1.0,
        referenceImages: [
          {
            id: 1,
            name: "Plastic Bottle",
            url: "https://images.unsplash.com/photo-1582719478190-ef42a9f53954",
          },
          {
            id: 2,
            name: "Plastic Bag",
            url: "https://images.unsplash.com/photo-1584270354949-2ab2b1e53d1c",
          },
        ],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
