import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Database-tti hidhuu
    await dbConnect();

    // 2. Deetaa frontend irraa dhufe fudhachuu
    const body = await req.json();
    const { name, email, score, subject } = body;

    // 3. Email-iin barataa jiraachuu isaa mirkaneessuun update gochuu
    // Upsert: true jechuun yoo barataan hin jirre haaraa uumi jechuudha
    const updatedStudent = await Student.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        $set: { name: name },
        $push: { 
          results: { 
            subject: subject, 
            score: Number(score), 
            date: new Date() 
          } 
        } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Qabxiin kee sirriitti save ta'eera!",
      data: updatedStudent 
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, error: "Hojichi hin milkoofne: " + error.message },
      { status: 500 }
    );
  }
}