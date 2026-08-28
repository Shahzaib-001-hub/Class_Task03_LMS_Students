import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";

const INITIAL_SAMPLE_STUDENTS = [
  { studentId: 1, name: "Ali", gender: "Male", age: 20, status: "Active", email: "ali@student.edu" },
  { studentId: 2, name: "Sara", gender: "Female", age: 21, status: "Active", email: "sara@student.edu" },
  { studentId: 3, name: "Usman Tariq", gender: "Male", age: 22, status: "Active", email: "usman.tariq@student.edu" },
  { studentId: 4, name: "Ayesha Noor", gender: "Female", age: 19, status: "Inactive", email: "ayesha.noor@student.edu" },
  { studentId: 5, name: "Bilal Ahmed", gender: "Male", age: 23, status: "Active", email: "bilal.ahmed@student.edu" },
  { studentId: 6, name: "Fatima Zahra", gender: "Female", age: 20, status: "Active", email: "fatima.zahra@student.edu" },
  { studentId: 7, name: "Zain Malik", gender: "Male", age: 24, status: "Inactive", email: "zain.malik@student.edu" },
  { studentId: 8, name: "Hina Siddiqui", gender: "Female", age: 21, status: "Active", email: "hina.siddiqui@student.edu" },
];

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing students
    await Student.deleteMany({});

    // Insert initial samples
    await Student.insertMany(INITIAL_SAMPLE_STUDENTS);

    const students = await Student.find({}).sort({ studentId: 1 }).lean();
    const formatted = students.map((s) => ({
      _id: s._id.toString(),
      id: s.studentId,
      name: s.name,
      gender: s.gender,
      age: s.age,
      status: s.status,
      email: s.email || "",
      createdAt: s.createdAt,
    }));

    return NextResponse.json({
      success: true,
      message: "Database reseeded successfully with default students",
      data: formatted,
    });
  } catch (error) {
    console.error("POST /api/students/seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

