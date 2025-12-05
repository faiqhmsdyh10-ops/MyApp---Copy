import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const ShareModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white rounded-xl p-6 w-[60vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold px-2">Bagikan Aksi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 px-2">&times;</button>
        </div>
        <p className="mb-2 text-sm px-2">Bagikan Melalui</p>
        <div className="flex space-x-4 mb-4 px-2">
          <FaFacebook className="text-blue-600 w-10 h-10 cursor-pointer border border-blue-600 rounded-full p-2" />
          <FaInstagram className="text-pink-500 w-10 h-10 cursor-pointer border border-pink-500 rounded-full p-2" />
          <FaTwitter className="text-blue-400 w-10 h-10 cursor-pointer border border-blue-400 rounded-full p-2" />
          <FaLinkedin className="text-blue-700 w-10 h-10 cursor-pointer border border-blue-700 rounded-full p-2" />
        </div>
        <div className="flex items-center rounded-xl p-2">
          <input
            type="text"
            value="https://ruangberbagi.com/aksi/3161288"
            readOnly
            className="flex-grow outline-none bg-white text-sm rounded-lg py-2"
          />
          <button className="text-blue-800 bg-blue-50 hover:text-blue-800 border border-blue-600 text-sm px-4 py-2 rounded-lg mb-3 ml-2">Salin</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;