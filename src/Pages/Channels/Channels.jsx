import React, { useEffect, useState } from "react";

const Channels = () => {
  const [channels, setChannels] = useState([]); // store only array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/channels`);
        const data = await res.json();

        // Log response to verify structure
        console.log("API Response:", data);

        // ✅ FIX: use data.approved instead of data directly
        if (Array.isArray(data.approved)) {
          setChannels(data.approved);
        } else if (Array.isArray(data)) {
          // fallback in case API returns array directly
          setChannels(data);
        } else {
          setChannels([]);
        }
      } catch (err) {
        console.error("Error fetching channels:", err);
        setError("Failed to load channels");
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading channels...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  if (!channels.length) {
    return <p className="text-center text-gray-500 mt-6">No channels found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {channels.map((ch, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-200 bg-white"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{ch.channelName}</h2>
            <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-md">
              {ch.category || "General"}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>Subscribers:</strong>{" "}
              {ch.subscribers?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Views:</strong> {ch.views?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Price:</strong> ₹{ch.price || "N/A"}
            </p>
            <p>
              <strong>Monetized:</strong> {ch.monetized ? "✅ Yes" : "❌ No"}
            </p>
          </div>

          {ch.seller && (
            <div className="mt-4 border-t pt-2 text-xs text-gray-500">
              <p>Seller: {ch.seller}</p>
              {ch.contact && <p>Contact: {ch.contact}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Channels;
