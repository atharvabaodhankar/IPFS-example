import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      });

      setIpfsHash(res.data.IpfsHash);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">📁 IPFS File Uploader</h1>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-white file:text-gray-700 file:cursor-pointer"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </button>

        {ipfsHash && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700 break-all">
              <span className="font-medium text-gray-900">IPFS CID:</span> {ipfsHash}
            </p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline text-sm"
            >
              🔗 View File on IPFS
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
