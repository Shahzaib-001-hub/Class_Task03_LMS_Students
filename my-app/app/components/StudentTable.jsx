"use client";

import { useState, useMemo } from "react";

export default function StudentTable({
  students,
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  statusFilter,
  setStatusFilter,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onExportCSV,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);

  // Filter students based on searchTerm, genderFilter, statusFilter
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search term matching ID or Name
      const matchesSearch =
        searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm.trim()) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));

      // Gender filter matching
      const matchesGender = genderFilter === "ALL" || student.gender === genderFilter;

      // Status filter matching
      const matchesStatus = statusFilter === "ALL" || student.status === statusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [students, searchTerm, genderFilter, statusFilter]);

  // Sort students
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const hasActiveFilters = searchTerm !== "" || genderFilter !== "ALL" || statusFilter !== "ALL";

  const resetFilters = () => {
    setSearchTerm("");
    setGenderFilter("ALL");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-emerald-100 text-emerald-700 border-emerald-200",
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-rose-100 text-rose-700 border-rose-200",
      "bg-teal-100 text-teal-700 border-teal-200",
    ];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Top Header matching the sketch architecture: "Students + Add Student" */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Students</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {filteredStudents.length} {filteredStudents.length === 1 ? "Record" : "Records"}
                </span>
              </div>
              <p className="text-xs text-slate-500">Student enrollment records and profile actions</p>
            </div>
          </div>

          {/* Action Buttons: Add Student & Export */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onExportCSV}
              title="Export students to CSV"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <i className="fa-solid fa-file-arrow-down text-slate-500"></i>
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onAddStudent}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>+ Add Student</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID, or email..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-circle-xmark text-xs"></i>
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-venus-mars text-xs"></i>
            </div>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-filter text-xs"></i>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Applied Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span>Query: &ldquo;{searchTerm}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="hover:text-indigo-900"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </span>
            )}
            {genderFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span>Gender: {genderFilter}</span>
                <button
                  type="button"
                  onClick={() => setGenderFilter("ALL")}
                  className="hover:text-indigo-900"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </span>
            )}
            {statusFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span>Status: {statusFilter}</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className="hover:text-indigo-900"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Table Structure (Columns: ID | Name | Gender | Age | Status | Action) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {/* ID Column */}
              <th
                scope="col"
                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors w-20"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1.5">
                  <span>ID</span>
                  <i
                    className={`fa-solid ${
                      sortField === "id"
                        ? sortAsc
                          ? "fa-arrow-up text-indigo-600"
                          : "fa-arrow-down text-indigo-600"
                        : "fa-sort text-slate-400"
                    } text-xs`}
                  ></i>
                </div>
              </th>

              {/* Name Column */}
              <th
                scope="col"
                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  <i
                    className={`fa-solid ${
                      sortField === "name"
                        ? sortAsc
                          ? "fa-arrow-up text-indigo-600"
                          : "fa-arrow-down text-indigo-600"
                        : "fa-sort text-slate-400"
                    } text-xs`}
                  ></i>
                </div>
              </th>

              {/* Gender Column */}
              <th
                scope="col"
                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors w-32"
                onClick={() => handleSort("gender")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Gender</span>
                  <i
                    className={`fa-solid ${
                      sortField === "gender"
                        ? sortAsc
                          ? "fa-arrow-up text-indigo-600"
                          : "fa-arrow-down text-indigo-600"
                        : "fa-sort text-slate-400"
                    } text-xs`}
                  ></i>
                </div>
              </th>

              {/* Age Column */}
              <th
                scope="col"
                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors w-24"
                onClick={() => handleSort("age")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Age</span>
                  <i
                    className={`fa-solid ${
                      sortField === "age"
                        ? sortAsc
                          ? "fa-arrow-up text-indigo-600"
                          : "fa-arrow-down text-indigo-600"
                        : "fa-sort text-slate-400"
                    } text-xs`}
                  ></i>
                </div>
              </th>

              {/* Status Column */}
              <th
                scope="col"
                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors w-32"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <i
                    className={`fa-solid ${
                      sortField === "status"
                        ? sortAsc
                          ? "fa-arrow-up text-indigo-600"
                          : "fa-arrow-down text-indigo-600"
                        : "fa-sort text-slate-400"
                    } text-xs`}
                  ></i>
                </div>
              </th>

              {/* Action Column */}
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right w-36">
                <span>Action</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => {
                const isActive = student.status === "Active";
                const isMale = student.gender === "Male";
                const isFemale = student.gender === "Female";

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                        #{student.id}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 ${getAvatarColor(
                            student.name
                          )}`}
                        >
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{student.name}</span>
                          </div>
                          {student.email && (
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <span>{student.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          isMale
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : isFemale
                            ? "bg-pink-50 text-pink-700 border-pink-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            isMale ? "fa-mars" : isFemale ? "fa-venus" : "fa-genderless"
                          } text-xs`}
                        ></i>
                        <span>{student.gender}</span>
                      </span>
                    </td>

                    {/* Age */}
                    <td className="py-4 px-4 sm:px-6">
                      <span className="text-sm font-semibold text-slate-700 font-mono">
                        {student.age} <span className="text-xs font-normal text-slate-400">yrs</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                            : "bg-amber-50 text-amber-700 border-amber-200 shadow-xs"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                          }`}
                        ></span>
                        <span>{student.status}</span>
                      </span>
                    </td>

                    {/* Action (Edit / Delete) */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditStudent(student)}
                          title="Edit student"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-medium transition-all shadow-xs"
                        >
                          <i className="fa-solid fa-pen-to-square text-xs text-indigo-500"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student)}
                          title="Delete student"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 text-xs font-medium transition-all shadow-xs"
                        >
                          <i className="fa-solid fa-trash text-xs text-rose-500"></i>
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-3">
                      <i className="fa-solid fa-user-slash"></i>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">No students found</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      {hasActiveFilters
                        ? "No student matches the current search and filter criteria."
                        : "There are currently no students in the directory."}
                    </p>
                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        <i className="fa-solid fa-rotate-left mr-1.5"></i>
                        Reset Filters
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onAddStudent}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
                      >
                        <i className="fa-solid fa-plus mr-1.5"></i>
                        Add First Student
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Table Footer */}
      <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="font-semibold text-slate-900">{sortedStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{" "}
            <strong className="font-semibold text-slate-900">
              {Math.min(currentPage * pageSize, sortedStudents.length)}
            </strong>{" "}
            of <strong className="font-semibold text-slate-900">{sortedStudents.length}</strong> entries
          </span>

          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            <i className="fa-solid fa-chevron-left mr-1 text-[10px]"></i> Prev
          </button>

          <div className="px-3 py-1.5 font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            Next <i className="fa-solid fa-chevron-right ml-1 text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

