import React, { useState, useEffect, useCallback } from 'react'
import { getTransparansiByAksi } from '../api'

const TransparansiDonasi = ({ isOpen, onClose, aksiId }) => {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchTransparansi = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getTransparansiByAksi(aksiId)
      setUpdates(response.data || [])
    } catch (error) {
      console.error('Error fetching transparansi:', error)
      setUpdates([])
    } finally {
      setLoading(false)
    }
  }, [aksiId])

  useEffect(() => {
    if (isOpen && aksiId) {
      fetchTransparansi()
    }
  }, [isOpen, aksiId, refreshKey, fetchTransparansi])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">📊 Transparansi Donasi</h3>
            <p className="text-sm text-gray-500 mt-1">Update progress dari admin</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefreshKey(prev => prev + 1)
                fetchTransparansi()
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Refresh"
            >
              🔄
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">😔</p>
              <p className="text-gray-600 text-lg font-medium">Belum ada update</p>
              <p className="text-gray-400 text-sm mt-2">Admin akan segera memposting progress donasi di sini</p>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Timeline */}
              <div className="relative">
                {/* Timeline items */}
                {updates.map((update, index) => (
                  <div key={update.id} className="pb-8">
                    <div className="flex gap-4">
                      {/* Timeline dot & line */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                        {index < updates.length - 1 && (
                          <div className="w-1 h-16 bg-gradient-to-b from-blue-600 to-blue-300 mt-2"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        {/* Date */}
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          📅 {new Date(update.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>

                        {/* Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                          {/* Title */}
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{update.judul}</h4>

                          {/* Description */}
                          {update.deskripsi && (
                            <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{update.deskripsi}</p>
                          )}

                          {/* Image */}
                          {update.gambar_url && (
                            <div className="mb-4 rounded-lg overflow-hidden">
                              <img
                                src={update.gambar_url}
                                alt={update.judul}
                                className="w-full h-64 object-cover hover:scale-105 transition duration-300"
                              />
                            </div>
                          )}

                          {/* Meta */}
                          <p className="text-xs text-gray-400">
                            Diposting: {new Date(update.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {updates.length > 0 && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
            Total {updates.length} update progress
          </div>
        )}
      </div>
    </div>
  )
}

export default TransparansiDonasi
