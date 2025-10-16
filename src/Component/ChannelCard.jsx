import React from "react";
import { Card } from "antd";

const ChannelCard = ({ channel }) => {
  if (!channel) return null;

  return (
    <Card
      hoverable
      className="rounded-2xl shadow-md"
      cover={
        <img
          alt={channel.name}
          src={channel.thumbnail || "https://via.placeholder.com/300x180"}
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        />
      }
    >
      <h3 className="text-lg font-semibold mb-1">{channel.name}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Category: {channel.category || "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Subscribers: {channel.subscribers?.toLocaleString() || 0}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Views: {channel.views?.toLocaleString() || 0}
      </p>
      <p className="text-sm text-gray-600">
        Est. Earnings: ${channel.estimatedEarnings?.toLocaleString() || 0}
      </p>
    </Card>
  );
};

export default ChannelCard;
