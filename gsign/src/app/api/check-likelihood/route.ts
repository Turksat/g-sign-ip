import { NextRequest, NextResponse } from "next/server";

interface FileInfo {
  id: string;
  name: string;
}

interface RequestBody {
  claims: FileInfo[];
  abstract: FileInfo[];
  drawings: FileInfo[];
  supportingDocuments: FileInfo[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { claims, abstract, drawings, supportingDocuments } = body;

    // TESTING: Comment out validation for dummy success response
    /*
        // Validation: Check if required documents are uploaded
        if (!claims || claims.length === 0) {
            return NextResponse.json(
                { success: false, message: "Claims document is required" },
                { status: 400 }
            );
        }

        if (!abstract || abstract.length === 0) {
            return NextResponse.json(
                { success: false, message: "Abstract document is required" },
                { status: 400 }
            );
        }

        if (!drawings || drawings.length === 0) {
            return NextResponse.json(
                { success: false, message: "Drawings are required" },
                { status: 400 }
            );
        }
        */

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock likelihood rate calculation based on document count and quality
    let baseRate = 60; // Base rate

    // Increase rate based on document completeness
    if (claims && claims.length >= 1) baseRate += 5;
    if (abstract && abstract.length >= 1) baseRate += 5;
    if (drawings && drawings.length >= 1) baseRate += 5;
    if (supportingDocuments && supportingDocuments.length >= 1) baseRate += 5;

    // Add some randomness to make it more realistic
    const randomFactor = Math.random() * 20 - 10; // -10 to +10
    const finalRate = Math.max(
      10,
      Math.min(95, Math.round(baseRate + randomFactor))
    );

    // Determine message based on rate
    let message =
      "Based on the documents you have uploaded and the available patent data, the probability of your application being approved is estimated to be";

    if (finalRate >= 80) {
      message += " very high";
    } else if (finalRate >= 60) {
      message += " high";
    } else if (finalRate >= 40) {
      message += " moderate";
    } else {
      message += " low";
    }

    return NextResponse.json({
      success: true,
      likelihoodRate: finalRate,
      message: message,
      details: {
        claimsCount: claims?.length || 0,
        abstractCount: abstract?.length || 0,
        drawingsCount: drawings?.length || 0,
        supportingDocumentsCount: supportingDocuments?.length || 0,
        uploadedFiles: {
          claims: claims || [],
          abstract: abstract || [],
          drawings: drawings || [],
          supportingDocuments: supportingDocuments || [],
        },
      },
    });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to check likelihood rate" },
      { status: 500 }
    );
  }
}
