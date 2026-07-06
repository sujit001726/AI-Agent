import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message, subject } = body;

    // Log the contact submission
    console.log("=== Contact Form Submission ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Company: ${company || "N/A"}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log("===============================");

    // In a real application, you might save this in the database or send an email.
    // Example:
    // await prisma.contactSubmission.create({ data: { name, email, company, message, subject } });

    return NextResponse.json({ success: true, message: "Submission logged successfully" });
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json({ success: false, error: "Failed to process submission" }, { status: 500 });
  }
}
