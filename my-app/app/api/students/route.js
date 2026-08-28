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

// GET: Fetch all students
export async function GET() {
  try {
    await connectToDatabase();

    let students = await Student.find({}).sort({ studentId: 1 }).lean();

    // If database collection is empty, auto-seed with initial students
    if (students.length === 0) {
      await Student.insertMany(INITIAL_SAMPLE_STUDENTS);
      students = await Student.find({}).sort({ studentId: 1 }).lean();
    }

    // Format for frontend (map studentId to id)
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

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/students error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch students from MongoDB" },
      { status: 500 }
    );
  }
}

// POST: Add new student
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { name, gender, age, status, email } = body;

    if (!name || !gender || !age) {
      return NextResponse.json(
        { success: false, error: "Name, gender, and age are required" },
        { status: 400 }
      );
    }

    // Calculate next studentId
    const lastStudent = await Student.findOne({}).sort({ studentId: -1 }).lean();
    const nextStudentId = lastStudent ? lastStudent.studentId + 1 : 1;

    const newStudent = await Student.create({
      studentId: nextStudentId,
      name: name.trim(),
      gender,
      age: parseInt(age, 10),
      status: status || "Active",
      email: email ? email.trim() : `${name.toLowerCase().replace(/\s+/g, ".")}@student.edu`,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: newStudent._id.toString(),
          id: newStudent.studentId,
          name: newStudent.name,
          gender: newStudent.gender,
          age: newStudent.age,
          status: newStudent.status,
          email: newStudent.email,
          createdAt: newStudent.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/students error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create student in MongoDB" },
      { status: 500 }
    );
  }
}

