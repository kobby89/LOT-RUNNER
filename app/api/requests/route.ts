import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const NewRequestSchema = z.object({
  customerName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  lotNumber: z.string().optional(),
  makeModel: z.string().optional(),
  yearRangeMin: z.number().int().optional(),
  yearRangeMax: z.number().int().optional(),
  maxBudget: z.number().positive().optional(),
  notes: z.string().optional(),
});

// POST /api/requests — a customer submits a new car request.
// No payment happens here; this just opens the ticket.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = NewRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const request = await prisma.request.create({
    data: {
      ...parsed.data,
      statusEvents: {
        create: { status: "SUBMITTED", note: "Request submitted by customer." },
      },
    },
  });

  // TODO: send a "we got your request" email via Resend here.

  return NextResponse.json({ request }, { status: 201 });
}

// GET /api/requests — admin-only list of every open/closed request.
// Swap the header-token check below for real auth (Clerk/NextAuth/Supabase)
// before this ever sees production traffic.
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
