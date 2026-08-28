import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";
import mongoose from "mongoose";

// Helper to find by _id or studentId
async function findStudentByIdOrStudentId(idParam) {
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    const student = await Student.findById(idParam);
    if (student) return student;
  }
  const numericId = parseInt(idParam, 10);
  if (!isNaN(numericId)) {
    return await Student.findOne({ studentId: numericId });
  }
  return null;
}

// PUT: Update student
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const student = await findStudentByIdOrStudentId(id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: `Student with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (body.name !== undefined) student.name = body.name.trim();
    if (body.gender !== undefined) student.gender = body.gender;
    if (body.age !== undefined) student.age = parseInt(body.age, 10);
    if (body.status !== undefined) student.status = body.status;
    if (body.email !== undefined) student.email = body.email.trim();

    await student.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: student._id.toString(),
        id: student.studentId,
        name: student.name,
        gender: student.gender,
        age: student.age,
        status: student.status,
        email: student.email,
        updatedAt: student.updatedAt,
      },
    });
  } catch (error) {
    console.error(`PUT /api/students/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update student in MongoDB" },
      { status: 500 }
    );
  }
}

// DELETE: Delete student
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Student.findByIdAndDelete(id);
    }
    if (!deleted) {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        deleted = await Student.findOneAndDelete({ studentId: numericId });
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Student with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Student #${deleted.studentId} (${deleted.name}) deleted successfully`,
      deletedId: deleted.studentId,
    });
  } catch (error) {
    console.error(`DELETE /api/students/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete student from MongoDB" },
      { status: 500 }
    );
  }
}

