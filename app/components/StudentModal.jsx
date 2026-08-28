"use client";

import { useState, useEffect } from "react";

export default function StudentModal({ isOpen, onClose, onSave, studentToEdit }) {
  const isEditMode = Boolean(studentToEdit);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    age: "",
    status: "Active",
    email: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || "",
        gender: studentToEdit.gender || "Male",
        age: studentToEdit.age?.toString() || "",
        status: studentToEdit.status || "Active",
        email: studentToEdit.email || "",
      });
    } else {
      setFormData({
        name: "",
        gender: "Male",
        age: "",
        status: "Active",
        email: "",
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        newErrors.age = "Age must be between 5 and 100";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(studentToEdit ? { id: studentToEdit.id } : {}),
      name: formData.name.trim(),
      gender: formData.gender,
      age: parseInt(formData.age, 10),
      status: formData.status,
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@student.edu`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <i className={`fa-solid ${isEditMode ? "fa-user-pen" : "fa-user-plus"}`}></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditMode ? `Edit Student (ID: #${studentToEdit.id})` : "Add New Student"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode ? "Update student details in the directory" : "Enter details to enroll a new student"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-user text-sm"></i>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ali Khan"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.name
                    ? "border-rose-400 focus:ring-rose-400 text-rose-900"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900"
                }`}
                autoFocus
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Gender & Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <i className="fa-solid fa-venus-mars text-sm"></i>
                </div>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
              {errors.gender && <p className="text-xs text-rose-600 mt-1">{errors.gender}</p>}
            </div>

            {/* Age Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Age <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <i className="fa-solid fa-cake-candles text-sm"></i>
                </div>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 20"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.age
                      ? "border-rose-400 focus:ring-rose-400 text-rose-900"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900"
                  }`}
                />
              </div>
              {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Status Radio / Select Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                  formData.status === "Active"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === "Active"}
                  onChange={() => setFormData({ ...formData, status: "Active" })}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Active</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                  formData.status === "Inactive"
                    ? "bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === "Inactive"}
                  onChange={() => setFormData({ ...formData, status: "Inactive" })}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <i className="fa-solid fa-circle-xmark text-amber-600"></i>
                <span>Inactive</span>
              </label>
            </div>
          </div>

          {/* Email Field (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-regular fa-envelope text-sm"></i>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ali@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-colors"
            >
              <i className={`fa-solid ${isEditMode ? "fa-check" : "fa-plus"}`}></i>
              <span>{isEditMode ? "Save Changes" : "Add Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

