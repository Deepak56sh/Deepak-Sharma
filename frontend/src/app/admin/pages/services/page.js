'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';

import {
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Save,
  Sparkles,
} from 'lucide-react';

import 'react-quill-new/dist/quill.snow.css';

/* =========================================================
   REACT QUILL
   ========================================================= */

const ReactQuill = dynamic(
  () => import('react-quill-new'),
  {
    ssr: false,
  }
);


/* =========================================================
   API
   ========================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://my-site-backend-0661.onrender.com/api';


/* =========================================================
   CATEGORIES
   ========================================================= */

const CATEGORIES = [
  'Crop Farming',
  'Organic Farming',
  'Equipment',
  'Consulting',
  'Irrigation',
  'Other',
];


/* =========================================================
   QUILL FONT SIZE
   ========================================================= */

/*
  Quill default mein custom font sizes limited hote hain.

  Yahan hum apne sizes register kar rahe hain.
*/

const Size = Quill.import('attributors/style/size');

Size.whitelist = [
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '42px',
  '48px',
];

Quill.register(Size, true);


/* =========================================================
   QUILL TOOLBAR
   ========================================================= */

const quillModules = {
  toolbar: [
    /* Heading */
    [
      {
        header: [1, 2, 3, 4, 5, 6, false],
      },
    ],

    /* Font Size */
    [
      {
        size: [
          '10px',
          '12px',
          '14px',
          '16px',
          '18px',
          '20px',
          '24px',
          '28px',
          '32px',
          '36px',
          '42px',
          '48px',
        ],
      },
    ],

    /* Basic formatting */
    ['bold', 'italic', 'underline', 'strike'],

    /* Color */
    [
      {
        color: [],
      },
      {
        background: [],
      },
    ],

    /* Lists */
    [
      {
        list: 'ordered',
      },
      {
        list: 'bullet',
      },
    ],

    /* Alignment */
    [
      {
        align: [],
      },
    ],

    /* Indent */
    [
      {
        indent: '-1',
      },
      {
        indent: '+1',
      },
    ],

    /* Link + Image */
    ['link', 'image'],

    /* Clear formatting */
    ['clean'],
  ],
};


/* =========================================================
   QUILL FORMATS
   ========================================================= */

const quillFormats = [
  'header',
  'size',

  'bold',
  'italic',
  'underline',
  'strike',

  'color',
  'background',

  'list',
  'bullet',

  'align',
  'indent',

  'link',
  'image',
];


/* =========================================================
   DEFAULT FORM
   ========================================================= */

const DEFAULT_FORM = {
  title: '',
  description: '',
  category: 'Crop Farming',
  price: '',
  duration: '',
  isActive: true,
};


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openId, setOpenId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState(DEFAULT_FORM);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('adminToken')
      : null;


  /* =========================================================
     FETCH SERVICES
     ========================================================= */

  useEffect(() => {
    fetchServices();
  }, []);


  const fetchServices = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/services?limit=100&active=all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      const data = await res.json();

      if (data.success) {
        setServices(data.data || []);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Fetch services error:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     RESET FORM
     ========================================================= */

  const resetForm = () => {
    setForm({
      ...DEFAULT_FORM,
    });

    setImageFile(null);
    setPreview('');
  };


  /* =========================================================
     IMAGE CHANGE
     ========================================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  };


  /* =========================================================
     DESCRIPTION VALIDATION
     ========================================================= */

  const isDescriptionEmpty = () => {
    if (!form.description) {
      return true;
    }

    /*
      Quill empty HTML normally:
      <p><br></p>
    */

    const temp = document.createElement('div');

    temp.innerHTML = form.description;

    const text = temp.textContent?.trim() || '';

    return text.length === 0;
  };


  /* =========================================================
     CREATE SERVICE
     ========================================================= */

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Image is required');
      return;
    }

    if (isDescriptionEmpty()) {
      alert('Description is required');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('duration', form.duration);
      formData.append('isActive', String(form.isActive));

      formData.append('image', imageFile);

      const res = await fetch(
        `${API_URL}/services`,
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        alert('Service created successfully');

        setShowCreate(false);

        resetForm();

        await fetchServices();
      } else {
        alert(
          data.message ||
            'Failed to create service'
        );
      }
    } catch (error) {
      console.error('Create service error:', error);

      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     UPDATE SERVICE
     ========================================================= */

  const handleUpdate = async (id) => {
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }

    if (isDescriptionEmpty()) {
      alert('Description is required');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('duration', form.duration);
      formData.append('isActive', String(form.isActive));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(
        `${API_URL}/services/${id}`,
        {
          method: 'PUT',

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        alert('Service updated successfully');

        setEditMode(null);
        setOpenId(null);

        resetForm();

        await fetchServices();
      } else {
        alert(
          data.message ||
            'Failed to update service'
        );
      }
    } catch (error) {
      console.error('Update service error:', error);

      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this service?'
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/services/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchServices();
      } else {
        alert(
          data.message ||
            'Failed to delete service'
        );
      }
    } catch (error) {
      console.error('Delete error:', error);

      alert('Something went wrong');
    }
  };


  /* =========================================================
     TOGGLE ACTIVE
     ========================================================= */

  const handleToggle = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/services/${id}/toggle`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchServices();
      } else {
        alert(
          data.message ||
            'Failed to update status'
        );
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };


  /* =========================================================
     START EDIT
     ========================================================= */

  const startEdit = (service) => {
    setEditMode(service._id);

    setOpenId(service._id);

    setForm({
      title: service.title || '',

      description:
        service.description || '',

      category:
        service.category ||
        'Crop Farming',

      price:
        service.price || '',

      duration:
        service.duration || '',

      isActive:
        service.isActive !== false,
    });

    setPreview(service.image || '');

    setImageFile(null);
  };


  /* =========================================================
     CANCEL EDIT
     ========================================================= */

  const cancelEdit = () => {
    setEditMode(null);

    resetForm();
  };


  /* =========================================================
     CREATE TOGGLE
     ========================================================= */

  const toggleCreate = () => {
    if (showCreate) {
      setShowCreate(false);
      resetForm();

      return;
    }

    setShowCreate(true);

    setEditMode(null);

    resetForm();
  };


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="min-h-screen bg-[#F7F4EC] p-4 md:p-8">

      {/* =====================================================
          QUILL GLOBAL CSS
          ===================================================== */}

      <style jsx global>{`

        /* ============================================
           TOOLBAR
        ============================================ */

        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;

          border-color: #E4DFC9 !important;

          background: #FCFAF3;

          position: relative;

          z-index: 100;
        }


        /* ============================================
           EDITOR
        ============================================ */

        .ql-container.ql-snow {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;

          border-color: #E4DFC9 !important;

          font-family: inherit;

          font-size: 16px;
        }


        .ql-editor {
          min-height: 220px;

          line-height: 1.7;

          color: #3E4436;
        }


        /* ============================================
           DROPDOWN POPUPS
        ============================================ */

        .ql-snow .ql-picker-options {
          z-index: 99999 !important;

          background: #ffffff !important;

          border: 1px solid #E4DFC9 !important;

          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.12);

          border-radius: 8px;
        }


        /* ============================================
           COLOR PICKER
        ============================================ */

        .ql-snow .ql-color-picker .ql-picker-options {
          padding: 8px !important;
        }


        /* ============================================
           SIZE DROPDOWN
        ============================================ */

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label {
          width: 70px;
        }


        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="10px"]::before {
          content: "10px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="12px"]::before {
          content: "12px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="14px"]::before {
          content: "14px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="16px"]::before {
          content: "16px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="18px"]::before {
          content: "18px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="20px"]::before {
          content: "20px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="24px"]::before {
          content: "24px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="28px"]::before {
          content: "28px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="32px"]::before {
          content: "32px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="36px"]::before {
          content: "36px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="42px"]::before {
          content: "42px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-item[data-value="48px"]::before {
          content: "48px";
        }


        /* ============================================
           SELECTED SIZE LABEL
        ============================================ */

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="10px"]::before {
          content: "10px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="12px"]::before {
          content: "12px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="14px"]::before {
          content: "14px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="16px"]::before {
          content: "16px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="18px"]::before {
          content: "18px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="20px"]::before {
          content: "20px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="24px"]::before {
          content: "24px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="28px"]::before {
          content: "28px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="32px"]::before {
          content: "32px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="36px"]::before {
          content: "36px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="42px"]::before {
          content: "42px";
        }

        .ql-snow
        .ql-picker.ql-size
        .ql-picker-label[data-value="48px"]::before {
          content: "48px";
        }


        /* ============================================
           MOBILE TOOLBAR
        ============================================ */

        @media (max-width: 640px) {

          .ql-toolbar.ql-snow {
            padding: 8px;

            display: flex;

            flex-wrap: wrap;

            gap: 2px;
          }

          .ql-toolbar .ql-formats {
            margin-right: 4px;
          }

        }

      `}</style>


      <div className="max-w-5xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#23281D] flex items-center gap-2">

              <Sparkles className="w-6 h-6 text-[#3F6B44]" />

              Services

            </h1>

            <p className="text-[#5B6152] text-sm mt-1">
              Manage all farming services
            </p>

          </div>


          <button
            type="button"
            onClick={toggleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
          >

            <Plus className="w-5 h-5" />

            {showCreate
              ? 'Cancel'
              : 'Add Service'}

          </button>

        </div>


        {/* =================================================
            CREATE FORM
        ================================================= */}

        {showCreate && (

          <div className="bg-white rounded-2xl border border-[#E4DFC9] shadow-sm mb-6 overflow-visible">

            <div className="bg-gradient-to-r from-[#3F6B44] to-[#2C4E30] text-white px-6 py-4 font-semibold rounded-t-2xl">

              Create New Service

            </div>


            <form
              onSubmit={handleCreate}
              className="p-6 space-y-5"
            >

              {/* TITLE + CATEGORY */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                    Title *
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] outline-none transition"
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                  >

                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}

                  </select>

                </div>

              </div>


              {/* =================================================
                  RICH TEXT EDITOR
              ================================================= */}

              <div>

                <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                  Description *
                </label>

                <div className="bg-white rounded-xl">

                  <ReactQuill
                    theme="snow"

                    value={form.description}

                    onChange={(value) =>
                      setForm({
                        ...form,
                        description: value,
                      })
                    }

                    modules={quillModules}

                    formats={quillFormats}

                    placeholder="Write detailed content about this service..."
                  />

                </div>

              </div>


              {/* PRICE + DURATION */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                    Price
                  </label>

                  <input
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    placeholder="₹500 - ₹5000"
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                    Duration
                  </label>

                  <input
                    value={form.duration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration: e.target.value,
                      })
                    }
                    placeholder="2-4 weeks"
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                  />

                </div>

              </div>


              {/* IMAGE */}

              <div>

                <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                  Cover Image *
                </label>

                <div className="flex items-center gap-4 flex-wrap">

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[#F7F4EC] border border-dashed border-[#D8D2B8] rounded-xl cursor-pointer hover:bg-[#F0EBD8] transition">

                    <ImageIcon className="w-5 h-5 text-[#5B6152]" />

                    <span className="text-sm text-[#3E4436]">
                      {imageFile
                        ? imageFile.name
                        : 'Choose Image'}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>


                  {preview && (

                    <img
                      src={preview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-[#E4DFC9]"
                    />

                  )}

                </div>

                <p className="text-xs text-[#8A8F7C] mt-1">
                  Image Cloudinary pe upload hogi
                </p>

              </div>


              {/* ACTIVE */}

              <div className="flex items-center gap-2 bg-[#F7F4EC] px-4 py-3 rounded-xl">

                <input
                  type="checkbox"
                  id="create-isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#3F6B44]"
                />

                <label
                  htmlFor="create-isActive"
                  className="text-sm text-[#3E4436]"
                >
                  Active (visible on website)
                </label>

              </div>


              {/* BUTTONS */}

              <div className="flex items-center gap-3 pt-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-60"
                >

                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  Create Service

                </button>


                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 text-[#5B6152] hover:bg-[#F0EBD8] rounded-xl transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="flex justify-center py-20">

            <Loader2 className="w-8 h-8 text-[#3F6B44] animate-spin" />

          </div>

        ) : services.length === 0 ? (

          /* EMPTY */

          <div className="text-center py-20 bg-white rounded-2xl border border-[#E4DFC9]">

            <p className="text-[#5B6152]">
              No services yet
            </p>

          </div>

        ) : (

          /* =================================================
             SERVICES
          ================================================= */

          <div className="space-y-3">

            {services.map((service) => {

              const isOpen =
                openId === service._id;

              const isEditing =
                editMode === service._id;


              return (

                <div
                  key={service._id}
                  className="bg-white rounded-2xl border border-[#E4DFC9] shadow-sm hover:shadow-md transition-shadow overflow-visible"
                >

                  {/* =================================================
                     SERVICE HEADER
                  ================================================= */}

                  <div
                    onClick={() =>
                      setOpenId(
                        isOpen
                          ? null
                          : service._id
                      )
                    }
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F7F4EC] transition rounded-2xl"
                  >

                    <div className="flex items-center gap-4 min-w-0">

                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />


                      <div className="min-w-0">

                        <h3 className="font-semibold text-[#23281D] truncate">
                          {service.title}
                        </h3>


                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">

                          <span className="text-xs px-2 py-0.5 bg-[#3F6B44]/10 text-[#2C4E30] rounded-full">
                            {service.category}
                          </span>


                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              service.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {service.isActive
                              ? 'Active'
                              : 'Inactive'}
                          </span>

                        </div>

                      </div>

                    </div>


                    <div className="flex items-center gap-2 flex-shrink-0">

                      {/* TOGGLE */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleToggle(
                            service._id
                          );
                        }}
                        className="p-2 hover:bg-[#F0EBD8] rounded-lg transition"
                        title={
                          service.isActive
                            ? 'Hide from website'
                            : 'Show on website'
                        }
                      >

                        {service.isActive ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}

                      </button>


                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          startEdit(service);
                        }}
                        className="p-2 hover:bg-[#F0EBD8] rounded-lg transition"
                        title="Edit"
                      >

                        <Edit2 className="w-4 h-4 text-blue-600" />

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDelete(
                            service._id
                          );
                        }}
                        className="p-2 hover:bg-[#F0EBD8] rounded-lg transition"
                        title="Delete"
                      >

                        <Trash2 className="w-4 h-4 text-red-500" />

                      </button>


                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#8A8F7C]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#8A8F7C]" />
                      )}

                    </div>

                  </div>


                  {/* =================================================
                     BODY
                  ================================================= */}

                  {isOpen && (

                    <div className="border-t border-[#E4DFC9] px-5 py-5 bg-[#FCFAF3] rounded-b-2xl">

                      {isEditing ? (

                        /* =================================================
                           EDIT MODE
                        ================================================= */

                        <div className="space-y-5">

                          {/* TITLE CATEGORY */}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>

                              <label className="block text-sm font-medium text-[#3E4436] mb-1">
                                Title
                              </label>

                              <input
                                value={form.title}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                              />

                            </div>


                            <div>

                              <label className="block text-sm font-medium text-[#3E4436] mb-1">
                                Category
                              </label>

                              <select
                                value={form.category}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                              >

                                {CATEGORIES.map(
                                  (category) => (
                                    <option
                                      key={category}
                                      value={category}
                                    >
                                      {category}
                                    </option>
                                  )
                                )}

                              </select>

                            </div>

                          </div>


                          {/* =================================================
                              EDITOR
                          ================================================= */}

                          <div>

                            <label className="block text-sm font-medium text-[#3E4436] mb-1">
                              Description
                            </label>

                            <div className="bg-white rounded-lg">

                              <ReactQuill
                                theme="snow"

                                value={
                                  form.description
                                }

                                onChange={(value) =>
                                  setForm({
                                    ...form,
                                    description:
                                      value,
                                  })
                                }

                                modules={
                                  quillModules
                                }

                                formats={
                                  quillFormats
                                }
                              />

                            </div>

                          </div>


                          {/* PRICE + DURATION */}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>

                              <label className="block text-sm font-medium text-[#3E4436] mb-1">
                                Price
                              </label>

                              <input
                                value={
                                  form.price
                                }
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    price: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                              />

                            </div>


                            <div>

                              <label className="block text-sm font-medium text-[#3E4436] mb-1">
                                Duration
                              </label>

                              <input
                                value={
                                  form.duration
                                }
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    duration:
                                      e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
                              />

                            </div>

                          </div>


                          {/* IMAGE */}

                          <div>

                            <label className="block text-sm font-medium text-[#3E4436] mb-1">
                              Change Image
                            </label>

                            <div className="flex items-center gap-3 flex-wrap">

                              <label className="px-3 py-2 bg-white border border-dashed border-[#D8D2B8] rounded-lg cursor-pointer text-sm hover:bg-[#F7F4EC] transition">

                                Choose new image

                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={
                                    handleImageChange
                                  }
                                  className="hidden"
                                />

                              </label>


                              {preview && (

                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="w-12 h-12 object-cover rounded"
                                />

                              )}

                            </div>

                          </div>


                          {/* ACTIVE */}

                          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border border-[#E4DFC9]">

                            <input
                              type="checkbox"
                              id={`edit-active-${service._id}`}
                              checked={
                                form.isActive
                              }
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  isActive:
                                    e.target.checked,
                                })
                              }
                              className="w-4 h-4 accent-[#3F6B44]"
                            />

                            <label
                              htmlFor={`edit-active-${service._id}`}
                              className="text-sm text-[#3E4436]"
                            >
                              Active (visible on website)
                            </label>

                          </div>


                          {/* BUTTONS */}

                          <div className="flex gap-3 pt-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdate(
                                  service._id
                                )
                              }
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-5 py-2 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-lg text-sm font-medium shadow-sm transition disabled:opacity-60"
                            >

                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}

                              Save Changes

                            </button>


                            <button
                              type="button"
                              onClick={
                                cancelEdit
                              }
                              className="px-4 py-2 text-[#5B6152] hover:bg-[#F0EBD8] rounded-lg text-sm transition"
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      ) : (

                        /* =================================================
                           VIEW MODE
                        ================================================= */

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                          <div>

                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-40 object-cover rounded-xl"
                            />

                          </div>


                          <div className="md:col-span-2">

                            <div
                              className="prose prose-sm max-w-none text-[#3E4436]"
                              dangerouslySetInnerHTML={{
                                __html:
                                  service.description ||
                                  '',
                              }}
                            />


                            <div className="mt-4 flex gap-4 text-sm flex-wrap">

                              {service.price && (

                                <span>

                                  <span className="text-[#8A8F7C]">
                                    Price:
                                  </span>{' '}

                                  <strong className="text-[#3F6B44]">
                                    {service.price}
                                  </strong>

                                </span>

                              )}


                              {service.duration && (

                                <span>

                                  <span className="text-[#8A8F7C]">
                                    Duration:
                                  </span>{' '}

                                  {service.duration}

                                </span>

                              )}

                            </div>

                          </div>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}