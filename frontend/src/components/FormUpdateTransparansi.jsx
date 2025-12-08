import React, { useState } from 'react'
import { createTransparansi } from '../api'

const FormUpdateTransparansi = ({ onClose, aksiId, onSuccess }) => {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    judul: '',
    deskripsi: '',
    gambar: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, gambar: reader.result })
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.judul.trim()) {
      alert('Judul wajib diisi!')
      return
    }

    try {
      setLoading(true)
      const submitData = {
        aksi_id: aksiId,
        tanggal: formData.tanggal,
        judul: formData.judul,
        deskripsi: formData.deskripsi || null,
        gambar_url: formData.gambar // Base64 untuk sekarang
      }

      await createTransparansi(submitData)
      alert('✅ Update transparansi berhasil diposting!')
      
      // Call onSuccess if it's a function
      if (typeof onSuccess === 'function') {
        onSuccess()
      }
      
      resetForm()
    } catch (error) {
      alert('❌ Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      judul: '',
      deskripsi: '',
      gambar: null
    })
    setImagePreview(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">📝 Update Transparansi Donasi</h3>
            <p className="text-sm text-gray-500 mt-1">Bagikan progress kepada semua pendonasi</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📅 Tanggal Update</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📌 Judul Update <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              placeholder="Contoh: Barang sudah terkumpul 50%"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
            <p className="text-xs text-gray-400 mt-1">Judul yang menarik akan membuat pendonasi lebih tertarik</p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📄 Deskripsi (Opsional)</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Jelaskan detail progress donasi, terima kasih kepada pendonasi, atau rencana ke depan..."
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
            <p className="text-xs text-gray-400 mt-1">Tulis dengan detail agar pendonasi merasa dihargai</p>
          </div>

          {/* Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ Gambar (Opsional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <p className="text-sm text-blue-600 font-medium">Klik untuk mengubah gambar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-3xl">📸</p>
                    <p className="text-gray-700 font-medium">Klik atau drag gambar di sini</p>
                    <p className="text-xs text-gray-400">Max 5MB. Format: JPG, PNG, GIF</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Preview */}
          {formData.judul && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 font-semibold mb-3">👁️ PREVIEW</p>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">
                  📅 {new Date(formData.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <h4 className="text-base font-bold text-gray-900 mb-1">{formData.judul}</h4>
                {formData.deskripsi && (
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{formData.deskripsi}</p>
                )}
                {imagePreview && <p className="text-xs text-gray-400">+ 1 gambar</p>}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || !formData.judul.trim()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Memposting...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Posting Update</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormUpdateTransparansi
