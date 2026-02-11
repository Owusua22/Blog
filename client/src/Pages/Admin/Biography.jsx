import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBiographies,
  addBiography,
  editBiography,
  removeBiography,
} from "../../redux/slice/biographySlice";
import {
  User,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Type,
  Calendar,
  AlignLeft,
  ImageIcon,
  Layers,
  FileText,
} from "lucide-react";

const Biography = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const { items: biographies = [], loading, error } = useSelector(
    (state) => state.biography
  );

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedBioSections, setExpandedBioSections] = useState({});

  useEffect(() => {
    dispatch(fetchBiographies());
  }, [dispatch]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const resetForm = () => {
    setTitle("");
    setImage(null);
    setImagePreview(null);
    setExistingImage(null);
    setSections([]);
    setEditId(null);
    setExpandedSections({});
  };

  // ================================
  // IMAGE HANDLING
  // ================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification("error", "Title is required");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);
    formData.append("sections", JSON.stringify(sections));

    try {
      if (editId) {
        const result = await dispatch(
          editBiography({ id: editId, data: formData })
        );
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Biography updated successfully!");
        } else {
          showNotification("error", "Failed to update biography");
        }
      } else {
        const result = await dispatch(addBiography(formData));
        if (result.meta.requestStatus === "fulfilled") {
          showNotification("success", "Biography created successfully!");
        } else {
          showNotification("error", "Failed to create biography");
        }
      }
      resetForm();
      setShowForm(false);
    } catch {
      showNotification("error", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this biography?"))
      return;

    setDeletingId(id);
    try {
      const result = await dispatch(removeBiography(id));
      if (result.meta.requestStatus === "fulfilled") {
        showNotification("success", "Biography deleted successfully!");
        if (editId === id) resetForm();
      } else {
        showNotification("error", "Failed to delete biography");
      }
    } catch {
      showNotification("error", "An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  // ================================
  // EDIT
  // ================================
  const handleEdit = (bio) => {
    setEditId(bio._id);
    setTitle(bio.title || "");
    setSections(
      bio.sections?.map((sec) => ({
        name: sec.name || "",
        items:
          sec.items?.map((item) => ({
            heading: item.heading || "",
            content: item.content || "",
            date: item.date || "",
          })) || [],
      })) || []
    );
    setExistingImage(bio.profileImage?.url || null);
    setImage(null);
    setImagePreview(null);
    setShowForm(true);

    // Expand all sections in form
    const expanded = {};
    bio.sections?.forEach((_, i) => {
      expanded[i] = true;
    });
    setExpandedSections(expanded);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ================================
  // SECTION HANDLERS
  // ================================
  const handleAddSection = () => {
    const newIndex = sections.length;
    setSections([...sections, { name: "", items: [] }]);
    setExpandedSections((prev) => ({ ...prev, [newIndex]: true }));
  };

  const handleRemoveSection = (sIndex) => {
    const newSections = [...sections];
    newSections.splice(sIndex, 1);
    setSections(newSections);
  };

  const handleSectionChange = (sIndex, field, value) => {
    const newSections = [...sections];
    newSections[sIndex][field] = value;
    setSections(newSections);
  };

  const handleAddItem = (sIndex) => {
    const newSections = [...sections];
    newSections[sIndex].items.push({ heading: "", content: "", date: "" });
    setSections(newSections);
  };

  const handleRemoveItem = (sIndex, iIndex) => {
    const newSections = [...sections];
    newSections[sIndex].items.splice(iIndex, 1);
    setSections(newSections);
  };

  const handleItemChange = (sIndex, iIndex, field, value) => {
    const newSections = [...sections];
    newSections[sIndex].items[iIndex][field] = value;
    setSections(newSections);
  };

  const toggleFormSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleBioSection = (bioId, sIndex) => {
    const key = `${bioId}-${sIndex}`;
    setExpandedBioSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter
  const filteredBiographies = biographies.filter((bio) =>
    bio.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPreview = imagePreview || existingImage;

  return (
    <div className="min-h-full">
      {/* ===== NOTIFICATION ===== */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl border transition-all duration-500 ${
            notification.type === "success"
              ? "bg-[#0B1D3A] border-emerald-500/30 text-emerald-400"
              : "bg-[#0B1D3A] border-red-500/30 text-red-400"
          }`}
          style={{
            animation: "slideIn 0.4s ease-out",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-3 text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-lg overflow-hidden">
            <div
              className={`h-full rounded-b-lg ${
                notification.type === "success"
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
              style={{ animation: "progress 4s linear" }}
            />
          </div>
        </div>
      )}

      {/* ===== PAGE HEADER ===== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(197,163,78,0.15), rgba(197,163,78,0.05))",
              border: "1px solid rgba(197,163,78,0.2)",
            }}
          >
            <User className="w-5 h-5 text-[#C5A34E]" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#0B1D3A]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Biography Management
            </h1>
            <p
              className="text-xs text-[#627D98] uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Create, edit, and manage biographies
            </p>
          </div>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#627D98]" />
          <input
            type="text"
            placeholder="Search biographies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: showForm
              ? "#E4E7EB"
              : "linear-gradient(135deg, #C5A34E, #D4B555)",
            color: showForm ? "#627D98" : "#0B1D3A",
          }}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Close Form
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              New Biography
            </>
          )}
        </button>
      </div>

      {/* ===== BIOGRAPHY FORM ===== */}
      {showForm && (
        <div
          ref={formRef}
          className="mb-8 rounded-xl overflow-hidden border border-[#E4E7EB] shadow-sm"
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          {/* Form Header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #0B1D3A, #122B4D)",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A34E]/10 border border-[#C5A34E]/20 flex items-center justify-center">
              {editId ? (
                <Pencil className="w-4 h-4 text-[#C5A34E]" />
              ) : (
                <Plus className="w-4 h-4 text-[#C5A34E]" />
              )}
            </div>
            <div>
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {editId ? "Edit Biography" : "Create New Biography"}
              </h2>
              <p
                className="text-[10px] text-[#627D98] uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {editId
                  ? "Update the biography details below"
                  : "Fill in the details to create a biography"}
              </p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 bg-white space-y-6">
            {/* Title */}
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Biography Title
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FB3C8]" />
                <input
                  type="text"
                  placeholder="Enter biography title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Profile Image
              </label>

              <div className="flex items-start gap-4">
                {/* Preview */}
                {currentPreview ? (
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentPreview}
                      alt="Profile"
                      className="w-28 h-28 object-cover rounded-full border-2 border-[#C5A34E]/20 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        setExistingImage(null);
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-[#E4E7EB] rounded-full cursor-pointer hover:border-[#C5A34E]/40 hover:bg-[#C5A34E]/[0.02] transition-all duration-300 group flex-shrink-0">
                    <Upload className="w-5 h-5 text-[#C5A34E] group-hover:scale-110 transition-transform" />
                    <span
                      className="text-[9px] text-[#9FB3C8] mt-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Upload button when image exists */}
                {currentPreview && (
                  <div className="pt-2">
                    <label
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 border"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background:
                          "linear-gradient(135deg, rgba(197,163,78,0.1), rgba(197,163,78,0.03))",
                        borderColor: "rgba(197,163,78,0.2)",
                        color: "#C5A34E",
                      }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p
                      className="text-[10px] text-[#9FB3C8] mt-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ===== SECTIONS ===== */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  className="block text-[10px] font-semibold uppercase tracking-widest text-[#627D98]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Sections ({sections.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: "linear-gradient(135deg, #C5A34E, #D4B555)",
                    color: "#0B1D3A",
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Add Section
                </button>
              </div>

              {sections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#E4E7EB] rounded-lg">
                  <Layers className="w-8 h-8 text-[#E4E7EB] mb-2" />
                  <p
                    className="text-xs text-[#9FB3C8] mb-3"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    No sections added yet
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[#E4E7EB] text-[#627D98] hover:border-[#C5A34E]/30 hover:text-[#C5A34E] transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <Plus className="w-3 h-3" />
                    Add Your First Section
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {sections.map((section, sIndex) => (
                  <div
                    key={sIndex}
                    className="border border-[#E4E7EB] rounded-xl overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.3s ease-out ${sIndex * 0.05}s both`,
                    }}
                  >
                    {/* Section Header */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F7F9FC] transition-colors duration-200"
                      onClick={() => toggleFormSection(sIndex)}
                    >
                      <GripVertical className="w-4 h-4 text-[#E4E7EB] flex-shrink-0" />

                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold flex-shrink-0"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            background:
                              "linear-gradient(135deg, rgba(197,163,78,0.15), rgba(197,163,78,0.05))",
                            color: "#C5A34E",
                            border: "1px solid rgba(197,163,78,0.2)",
                          }}
                        >
                          {sIndex + 1}
                        </span>
                        <span
                          className="text-sm font-medium text-[#0B1D3A] truncate"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {section.name || "Untitled Section"}
                        </span>
                        <span
                          className="text-[10px] text-[#9FB3C8] flex-shrink-0"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          ({section.items.length} items)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSection(sIndex);
                        }}
                        className="w-7 h-7 rounded-md bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {expandedSections[sIndex] ? (
                        <ChevronUp className="w-4 h-4 text-[#9FB3C8] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#9FB3C8] flex-shrink-0" />
                      )}
                    </div>

                    {/* Section Body */}
                    {expandedSections[sIndex] && (
                      <div
                        className="px-4 pb-4 pt-1 border-t border-[#F0F2F5] bg-[#FAFBFC]"
                        style={{ animation: "fadeIn 0.2s ease-out" }}
                      >
                        {/* Section Name */}
                        <div className="mb-4">
                          <label
                            className="block text-[9px] font-semibold uppercase tracking-widest text-[#9FB3C8] mb-1.5"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Section Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Education, Career, Awards..."
                            value={section.name}
                            onChange={(e) =>
                              handleSectionChange(
                                sIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2.5 bg-white border border-[#E4E7EB] rounded-lg text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                          {section.items.map((item, iIndex) => (
                            <div
                              key={iIndex}
                              className="bg-white border border-[#E4E7EB] rounded-lg p-4 relative group"
                              style={{
                                animation: `fadeInUp 0.3s ease-out ${
                                  iIndex * 0.03
                                }s both`,
                              }}
                            >
                              {/* Item number badge */}
                              <div className="flex items-center justify-between mb-3">
                                <span
                                  className="text-[9px] font-bold uppercase tracking-widest text-[#9FB3C8]"
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                  Item {iIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem(sIndex, iIndex)
                                  }
                                  className="w-6 h-6 rounded-md bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Heading */}
                                <div>
                                  <label
                                    className="block text-[9px] font-semibold uppercase tracking-widest text-[#9FB3C8] mb-1"
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    Heading
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Item heading"
                                    value={item.heading}
                                    onChange={(e) =>
                                      handleItemChange(
                                        sIndex,
                                        iIndex,
                                        "heading",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E4E7EB] rounded-md text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  />
                                </div>

                                {/* Date */}
                                <div>
                                  <label
                                    className="block text-[9px] font-semibold uppercase tracking-widest text-[#9FB3C8] mb-1"
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    Date / Year
                                    <span className="normal-case tracking-normal text-[#C5C5C5] ml-1">
                                      (optional)
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 2020"
                                    value={item.date}
                                    onChange={(e) =>
                                      handleItemChange(
                                        sIndex,
                                        iIndex,
                                        "date",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E4E7EB] rounded-md text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300"
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Content */}
                              <div className="mt-3">
                                <label
                                  className="block text-[9px] font-semibold uppercase tracking-widest text-[#9FB3C8] mb-1"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  Content
                                </label>
                                <textarea
                                  placeholder="Write the content..."
                                  value={item.content}
                                  onChange={(e) =>
                                    handleItemChange(
                                      sIndex,
                                      iIndex,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E4E7EB] rounded-md text-sm text-[#0B1D3A] placeholder-[#9FB3C8] focus:outline-none focus:ring-2 focus:ring-[#C5A34E]/30 focus:border-[#C5A34E] transition-all duration-300 resize-vertical"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Item Button */}
                        <button
                          type="button"
                          onClick={() => handleAddItem(sIndex)}
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-dashed border-[#E4E7EB] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#627D98] hover:border-[#C5A34E]/30 hover:text-[#C5A34E] hover:bg-[#C5A34E]/[0.02] transition-all duration-300"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <Plus className="w-3 h-3" />
                          Add Item
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#F0F2F5]">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: "linear-gradient(135deg, #C5A34E, #D4B555)",
                  color: "#0B1D3A",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editId ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {editId ? (
                      <Pencil className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {editId ? "Update Biography" : "Save Biography"}
                  </>
                )}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#F7F9FC] border border-[#E4E7EB] rounded-lg text-[11px] font-semibold uppercase tracking-widest text-[#627D98] hover:bg-[#E4E7EB] transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ===== BIOGRAPHIES LIST ===== */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="text-lg font-bold text-[#0B1D3A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            All Biographies
          </h2>
          <span
            className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              fontFamily: "'Inter', sans-serif",
              background:
                "linear-gradient(135deg, rgba(197,163,78,0.15), rgba(197,163,78,0.05))",
              color: "#C5A34E",
              border: "1px solid rgba(197,163,78,0.2)",
            }}
          >
            {filteredBiographies.length}
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && !submitting && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#E4E7EB]"></div>
            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-[#C5A34E] animate-spin absolute inset-0"></div>
          </div>
          <p
            className="text-sm font-semibold text-[#0B1D3A]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Loading biographies...
          </p>
          <p
            className="text-xs text-[#627D98] mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Please wait a moment
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p
            className="text-sm font-semibold text-red-600 mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Failed to load biographies
          </p>
          <p
            className="text-xs text-[#627D98] mb-4 text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => dispatch(fetchBiographies())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: "linear-gradient(135deg, #C5A34E, #D4B555)",
              color: "#0B1D3A",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredBiographies.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="w-16 h-16 rounded-full bg-[#F7F9FC] border border-[#E4E7EB] flex items-center justify-center mb-4">
            <User className="w-7 h-7 text-[#9FB3C8]" />
          </div>
          <p
            className="text-sm font-semibold text-[#0B1D3A] mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm ? "No biographies found" : "No biographies yet"}
          </p>
          <p
            className="text-xs text-[#627D98] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first biography to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(135deg, #C5A34E, #D4B555)",
                color: "#0B1D3A",
              }}
            >
              <Plus className="w-4 h-4" />
              Create Biography
            </button>
          )}
        </div>
      )}

      {/* Biographies List */}
      {!loading && !error && filteredBiographies.length > 0 && (
        <div className="space-y-5">
          {filteredBiographies.map((bio, index) => (
            <div
              key={bio._id}
              className="group bg-white border border-[#E4E7EB] rounded-xl overflow-hidden hover:border-[#C5A34E]/30 hover:shadow-lg transition-all duration-300"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
              }}
            >
              {/* Bio Header */}
              <div className="flex flex-col sm:flex-row">
                {/* Profile Image */}
                <div className="sm:w-40 h-36 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[#0B1D3A] to-[#122B4D] flex items-center justify-center relative overflow-hidden p-6">
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  {bio.profileImage?.url ? (
                    <img
                      src={bio.profileImage.url}
                      alt={bio.title}
                      className="w-24 h-24 object-cover rounded-full border-2 border-[#C5A34E]/30 shadow-lg relative z-10"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#1B3A5C] border-2 border-[#C5A34E]/20 flex items-center justify-center relative z-10">
                      <User className="w-10 h-10 text-[#627D98]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3
                        className="text-xl font-bold text-[#0B1D3A] group-hover:text-[#C5A34E] transition-colors duration-300"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        {bio.title}
                      </h3>
                      <p
                        className="text-xs text-[#9FB3C8] mt-0.5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {bio.sections?.length || 0} sections •{" "}
                        {bio.sections?.reduce(
                          (acc, s) => acc + (s.items?.length || 0),
                          0
                        ) || 0}{" "}
                        items
                      </p>
                    </div>

                    {bio.createdAt && (
                      <span
                        className="flex-shrink-0 text-[10px] font-medium text-[#627D98] bg-[#F7F9FC] px-2 py-1 rounded-md border border-[#E4E7EB]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {new Date(bio.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Sections Preview */}
                  {bio.sections && bio.sections.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {bio.sections.map((section, sIndex) => {
                        const sectionKey = `${bio._id}-${sIndex}`;
                        const isExpanded = expandedBioSections[sectionKey];

                        return (
                          <div
                            key={sIndex}
                            className="border border-[#F0F2F5] rounded-lg overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleBioSection(bio._id, sIndex)
                              }
                              className="w-full flex items-center justify-between px-3 py-2 bg-[#FAFBFC] hover:bg-[#F7F9FC] transition-colors text-left"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-flex items-center justify-center w-5 h-5 rounded text-[8px] font-bold flex-shrink-0"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    background:
                                      "linear-gradient(135deg, rgba(197,163,78,0.15), rgba(197,163,78,0.05))",
                                    color: "#C5A34E",
                                    border:
                                      "1px solid rgba(197,163,78,0.2)",
                                  }}
                                >
                                  {sIndex + 1}
                                </span>
                                <span
                                  className="text-xs font-semibold text-[#0B1D3A]"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  {section.name}
                                </span>
                                <span
                                  className="text-[10px] text-[#9FB3C8]"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  ({section.items?.length || 0})
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[#9FB3C8]" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-[#9FB3C8]" />
                              )}
                            </button>

                            {isExpanded && section.items && (
                              <div
                                className="px-3 pb-3 pt-1 space-y-2 bg-white"
                                style={{ animation: "fadeIn 0.2s ease-out" }}
                              >
                                {section.items.map((item, iIndex) => (
                                  <div
                                    key={iIndex}
                                    className="flex items-start gap-2 py-1.5 border-b border-[#F7F9FC] last:border-0"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-[#C5A34E] mt-2 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <span
                                        className="text-xs font-semibold text-[#0B1D3A]"
                                        style={{
                                          fontFamily: "'Inter', sans-serif",
                                        }}
                                      >
                                        {item.heading}
                                      </span>
                                      {item.date && (
                                        <span
                                          className="text-[10px] text-[#C5A34E] ml-2"
                                          style={{
                                            fontFamily:
                                              "'Inter', sans-serif",
                                          }}
                                        >
                                          ({item.date})
                                        </span>
                                      )}
                                      {item.content && (
                                        <p
                                          className="text-[11px] text-[#627D98] mt-0.5 line-clamp-2"
                                          style={{
                                            fontFamily:
                                              "'Inter', sans-serif",
                                          }}
                                        >
                                          {item.content}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(bio)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background:
                          "linear-gradient(135deg, rgba(197,163,78,0.1), rgba(197,163,78,0.03))",
                        borderColor: "rgba(197,163,78,0.2)",
                        color: "#C5A34E",
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(bio._id)}
                      disabled={deletingId === bio._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {deletingId === bio._id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Biography;