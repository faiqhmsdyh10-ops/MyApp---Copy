import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfilSaya = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || !userDataStr) {
      navigate("/login");
      return;
    }

    const data = JSON.parse(userDataStr);
    setUserData(data);
    setFormData(data);
    if (data.profilePhoto) {
      setPhotoPreview(data.profilePhoto);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (gender) => {
    setFormData({
      ...formData,
      gender: gender,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      profilePhoto: profilePhoto || formData.profilePhoto,
    };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    setUserData(updatedData);
    setFormData(updatedData);
    setIsEditing(false);
    setProfilePhoto(null);
    
    // Update photoPreview to reflect the saved photo
    if (updatedData.profilePhoto) {
      setPhotoPreview(updatedData.profilePhoto);
    }
    
    // Dispatch custom event to notify other components (like Navbar)
    window.dispatchEvent(new Event("userDataUpdated"));
    
    alert("Profil berhasil diperbarui!");
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Background Image Section */}
        <div 
          className="w-full relative"
          style={{ 
            backgroundImage: "url('/images/profile.jpg')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "700px",
            backgroundColor: "#f3f4f6"
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-none pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent"></div>
        </div>

        {/* Content Container - positioned absolutely over background */}
        <div className="max-w-6xl mx-auto px-4" style={{ position: "relative", marginTop: "-600px" }}>
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xs overflow-hidden mb-8">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-300 via-purple-200 to-yellow-100"></div>

            {/* Profile Info Section */}
            <div className="relative px-8 pb-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 mb-6">
                {/* Avatar */}
                <div className="relative mb-4 md:mb-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profil"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-5xl border-4 border-white shadow-lg">
                      {userData.name?.charAt(0).toUpperCase() || userData.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Name and Email */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{userData.name || "User"}</h1>
                  <p className="text-gray-500 text-sm">{userData.email}</p>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    if (isEditing) {
                      setFormData(userData);
                      setPhotoPreview(userData.profilePhoto || null);
                      setProfilePhoto(null);
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium self-end md:self-auto"
                >
                  {isEditing ? "Batal" : "Edit"}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-xs border p-8 mb-12">
            {isEditing ? (
              <div className="space-y-6">
                {/* Full Name and Nick Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap kamu"
                      className="w-full px-4 py-2 border text-black bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Panggilan</label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname || ""}
                      onChange={handleInputChange}
                      placeholder="Nama panggilan kamu"
                      className="w-full px-4 py-2 border text-black bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Gender and Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Laki-laki"
                          checked={formData.gender === "Laki-laki"}
                          onChange={(e) => handleGenderChange(e.target.value)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-gray-700">Laki-laki</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Perempuan"
                          checked={formData.gender === "Perempuan"}
                          onChange={(e) => handleGenderChange(e.target.value)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-gray-700">Perempuan</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Negara</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      placeholder="Asal negara kamu"
                      className="w-full px-4 py-2 border text-black bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-6 border-t">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">Full Name</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.name || "-"}</p>
                </div>

                {/* Nick Name */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">Nick Name</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.nickname || "-"}</p>
                </div>

                {/* Gender */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">Gender</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.gender || "-"}</p>
                </div>

                {/* Country */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">Country</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.country || "-"}</p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">No. Telepon</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.phone || "-"}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">My Email Address</p>
                  <div className="mt-4 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" checked readOnly className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userData.email}</p>
                      <p className="text-xs text-gray-500">1 month ago</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">Alamat</p>
                  <p className="text-lg text-gray-900 mt-1">{userData.address || "-"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilSaya;
