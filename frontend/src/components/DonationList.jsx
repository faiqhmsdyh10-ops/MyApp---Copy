import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAksi } from "../api";  // ← IMPORT INI

const DonationList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch campaigns dari Supabase
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await getAllAksi();
        setCampaigns(data);
        setError("");
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Gagal memuat data campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  if (loading) {
    return <div className="text-center py-8">Memuat campaigns...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (campaigns.length === 0) {
    return <div className="text-center py-8">Belum ada campaign tersedia</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const progress = campaign.target_amount > 0
          ? Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)
          : 0;

        return (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200">
              {campaign.image_url && (
                <img
                  src={campaign.image_url}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              {campaign.category && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {campaign.category}
                </span>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold mt-2 text-gray-900">
                {campaign.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {campaign.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Terkumpul</span>
                  <span className="font-semibold text-gray-900">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Amount */}
              <div className="mt-3">
                <p className="text-lg font-bold text-blue-600">
                  Rp {campaign.current_amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">
                  dari target Rp {campaign.target_amount.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => handleDetail(campaign.id)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Donasi Sekarang
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DonationList;