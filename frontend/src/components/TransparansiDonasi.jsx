import React, { useState, useEffect, useCallback } from 'react'
import { getTransparansiByAksi } from '../api'
import { RefreshCcw, X } from "lucide-react";

const TransparansiDonasi = ({ isOpen, onClose, aksiId }) => {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchTransparansi = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getTransparansiByAksi(aksiId)
      const data = response.data || []
      // Sort by tanggal/created_at ascending (oldest first), so when we reverse for display, newest is on top
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.tanggal || a.created_at)
        const dateB = new Date(b.tanggal || b.created_at)
        return dateA - dateB
      })
      setUpdates(sortedData)
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
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="sticky z-10 top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Progress Donasi</h3>
            <p className="text-sm text-gray-500 mt-1">Update progress dari admin</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefreshKey(prev => prev + 1)
                fetchTransparansi()
              }}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition focus:ring-0"
              title="Refresh"
            >
              <RefreshCcw />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-600 w-8 h-8 flex items-center justify-center"
            >
              <X />
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
                {[...updates].reverse().map((update, index) => {
                  // Nomor dimulai dari update pertama (awal), tapi ditampilkan dari terbaru di atas
                  const actualIndex = updates.length - 1 - index
                  return (
                    <div key={update.id} className="pb-0">
                      <div className="flex gap-4">
                        {/* Timeline dot & line */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-blue-50 border border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
                            {actualIndex + 1}
                          </div>
                          {index < updates.length - 1 && (
                            <div className="w-0.5 min-h-[150px] bg-gray-200 mt-0 flex-grow"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0 pb-8">
                          {/* Date */}
                          <p className="text-md text-gray-500 font-medium mb-1">
                            {new Date(update.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>

                          {/* Card */}
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-600">
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
                  )
                })}
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
