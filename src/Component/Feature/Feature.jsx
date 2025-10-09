import React, { useEffect, useState } from "react";
import axios from "axios";

const Feature = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch channels using the Vite proxy
  const fetchFeaturedChannels = async () => {
    try {
      const response = await
      axios.get("http://localhost:8090/api/channels/demanding");
 
      setChannels(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch channels:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedChannels();
  }, []);

  if (loading) return <p>Loading featured channels...</p>;
  if (error) return <p>Error loading channels. Check console.</p>;

  return (
    <div className="featured-channels">
      {channels.map((channel) => (
        <div key={channel.id} className="channel-card">
          <h3>{channel.name}</h3>
          <p>{channel.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Feature;
