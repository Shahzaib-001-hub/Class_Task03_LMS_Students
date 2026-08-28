import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [5, "Age must be at least 5"],
      max: [100, "Age must be at most 100"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose overwrite model error during hot reload
const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;

