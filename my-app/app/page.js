"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import StatsOverview from "./components/StatsOverview";
import StudentTable from "./components/StudentTable";
import StudentModal from "./components/StudentModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Toast from "./components/Toast";

// Initial seed data as per sketch for offline fallback
const FALLBACK_STUDENTS = [
  { id: 1, name: "Ali", gender: "Male", age: 20, status: "Active", email: "ali@student.edu" },
  { id: 2, name: "Sara", gender: "Female", age: 21, status: "Active", email: "sara@student.edu" },
  { id: 3, name: "Usman Tariq", gender: "Male", age: 22, status: "Active", email: "usman.tariq@student.edu" },
  { id: 4, name: "Ayesha Noor", gender: "Female", age: 19, status: "Inactive", email: "ayesha.noor@student.edu" },
  { id: 5, name: "Bilal Ahmed", gender: "Male", age: 23, status: "Active", email: "bilal.ahmed@student.edu" },
  { id: 6, name: "Fatima Zahra", gender: "Female", age: 20, status: "Active", email: "fatima.zahra@student.edu" },
  { id: 7, name: "Zain Malik", gender: "Male", age: 24, status: "Inactive", email: "zain.malik@student.edu" },
  { id: 8, name: "Hina Siddiqui", gender: "Female", age: 21, status: "Active", email: "hina.siddiqui@student.edu" },
];

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState("checking"); // "checking" | "connected" | "error"
  const [dbErrorMsg, setDbErrorMsg] = useState("");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch Students from MongoDB API
  const fetchStudents = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch("/api/students", { cache: "no-store" });
      const result = await res.json();

      if (res.ok && result.success) {
        setStudents(result.data);
        setDbStatus("connected");
        setDbErrorMsg("");
        try {
          localStorage.setItem("lms_students_backup", JSON.stringify(result.data));
        } catch {
          // ignore storage quota errors
        }
      } else {
        throw new Error(result.error || "Failed to load from MongoDB");
      }
    } catch (err) {
      console.warn("MongoDB fetch notice:", err.message);
      setDbStatus("error");
      setDbErrorMsg(err.message);

      // Gracefully fallback to localStorage or default sample
      try {
        const cached = localStorage.getItem("lms_students_backup");
        if (cached) {
          setStudents(JSON.parse(cached));
        } else {
          setStudents(FALLBACK_STUDENTS);
        }
      } catch {
        setStudents(FALLBACK_STUDENTS);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(true);
  }, [fetchStudents]);

  // Stats calculation
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const inactiveStudents = students.filter((s) => s.status === "Inactive").length;

  // Handle Stat Card Click -> Table Filter Sync
  const handleStatFilterSelect = (filterType) => {
    if (statusFilter === filterType) {
      setStatusFilter("ALL");
    } else {
      setStatusFilter(filterType);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  // Save Student (Add or Edit via MongoDB API)
  const handleSaveStudent = async (formData) => {
    try {
      if (formData.id) {
        // Edit Mode: PUT /api/students/[id]
        const res = await fetch(`/api/students/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (res.ok && result.success) {
          setStudents((prev) =>
            prev.map((s) => (s.id === formData.id ? { ...s, ...result.data } : s))
          );
          showToast(`Student #${formData.id} (${formData.name}) updated in MongoDB!`, "success");
        } else {
          // Fallback update in local state if offline
          setStudents((prev) =>
            prev.map((s) => (s.id === formData.id ? { ...s, ...formData } : s))
          );
          showToast(`Student #${formData.id} updated locally (DB offline)`, "info");
        }
      } else {
        // Add Mode: POST /api/students
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (res.ok && result.success) {
          setStudents((prev) => [...prev, result.data]);
          showToast(`Student "${result.data.name}" added to MongoDB (ID: #${result.data.id})!`, "success");
        } else {
          // Fallback create in local state if offline
          const maxId = students.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0);
          const localNew = { ...formData, id: maxId + 1 };
          setStudents((prev) => [...prev, localNew]);
          showToast(`Student "${localNew.name}" created locally (DB offline)`, "info");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Error connecting to server. Updated locally.", "error");
    } finally {
      setIsModalOpen(false);
      setStudentToEdit(null);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Student via DELETE /api/students/[id]
  const handleConfirmDelete = async (studentId) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
        showToast(`Student #${studentId} deleted from MongoDB.`, "success");
      } else {
        // Fallback local deletion
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
        showToast(`Student #${studentId} removed from local list.`, "info");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      showToast(`Student #${studentId} removed locally.`, "info");
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  // Reseed MongoDB database
  const handleResetData = async () => {
    if (!window.confirm("Are you sure you want to reset & reseed the database to default students?")) {
      return;
    }

    try {
      const res = await fetch("/api/students/seed", { method: "POST" });
      const result = await res.json();

      if (res.ok && result.success) {
        setStudents(result.data);
        setSearchTerm("");
        setGenderFilter("ALL");
        setStatusFilter("ALL");
        showToast("MongoDB reseeded with default students!", "success");
      } else {
        setStudents(FALLBACK_STUDENTS);
        showToast("Reset to sample students locally.", "info");
      }
    } catch (err) {
      console.error("Seed error:", err);
      setStudents(FALLBACK_STUDENTS);
      showToast("Reset to sample students.", "info");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      showToast("No students to export.", "error");
      return;
    }

    const headers = ["ID", "Name", "Gender", "Age", "Status", "Email"];
    const rows = students.map((s) => [
      s.id,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      s.gender,
      s.age,
      s.status,
      `"${(s.email || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_mongodb_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Student directory exported to CSV!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header dbStatus={dbStatus} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Database Status Alert Banner if offline / connecting */}
        {dbStatus === "error" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                <i className="fa-solid fa-database"></i>
              </div>
              <div>
                <span className="font-bold">MongoDB Connection Notice:</span> Operating in cached offline mode.
                <span className="block text-amber-700 mt-0.5">
                  To connect live MongoDB: Ensure MongoDB is running on <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">127.0.0.1:27017</code> or set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">MONGODB_URI</code> in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchStudents(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Retry MongoDB</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton or Main Content */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        ) : (
          <>
            {/* Schematic Tree & Stat Overview Cards (Total Students, Active Students, Inactive Students) */}
            <section aria-label="Student Statistics">
              <StatsOverview
                total={totalStudents}
                active={activeStudents}
                inactive={inactiveStudents}
                selectedFilter={statusFilter}
                onSelectFilter={handleStatFilterSelect}
              />
            </section>

            {/* Student Table Section */}
            <section aria-label="Student Directory Table">
              <StudentTable
                students={students}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onAddStudent={handleOpenAddModal}
                onEditStudent={handleOpenEditModal}
                onDeleteStudent={handleOpenDeleteModal}
                onExportCSV={handleExportCSV}
              />
            </section>
          </>
        )}

        {/* Footer controls & utilities */}
        <footer className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <i className={`fa-solid fa-database ${dbStatus === "connected" ? "text-emerald-500" : "text-amber-500"}`}></i>
            <span>
              {dbStatus === "connected" ? "MongoDB Live Connection Active" : "Local Data Storage"} •{" "}
              {students.length} Total records
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={handleResetData}
              className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <i className="fa-solid fa-arrow-rotate-left"></i>
              <span>Reseed Sample Students</span>
            </button>
            <span className="text-slate-300">•</span>
            <span>Student Management LMS Portal</span>
          </div>
        </footer>
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
      />

      {/* Toast Notification Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
