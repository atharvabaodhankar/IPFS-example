// src/App.jsx
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
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`

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
    <div style={{ padding: "2rem" }}>
      <h1>IPFS File Uploader (Pinata)</h1>
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload to IPFS"}
      </button>
      {ipfsHash && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>IPFS CID:</strong> {ipfsHash}</p>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
