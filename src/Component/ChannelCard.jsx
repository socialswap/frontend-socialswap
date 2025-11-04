import React from "react";
import { Card, Tag, Tooltip } from "antd";
import { EyeOutlined, UserOutlined, DollarOutlined, GlobalOutlined, YoutubeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();

  if (!channel) return null;

  const handleClick = () => {
    navigate(`/channel/${channel._id}`);
  };

  const banner = channel.bannerUrl || channel.imageUrls?.[0];
  const avatar = channel.avatar || channel.imageUrls?.[0];

  return (
    <div
      onClick={handleClick}
      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer border border-gray-100 hover:-translate-y-1"
    >
      {/* Banner Section */}
      <div className="relative h-40">
        <img
          src={banner}
          alt={channel.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-3 left-4">
          <h3 className="text-lg text-white font-semibold line-clamp-1">
            {channel.name}
          </h3>
          <p className="text-xs text-gray-200">
            {channel.category || "N/A"} • {channel.channelType}
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="p-4">
        {/* Avatar & Monetization */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-700 line-clamp-1">
                {channel.my_language || "N/A"} • {channel.country?.trim() || "Unknown"}
              </p>
              <Tag
                color={channel.monetized ? "green" : "volcano"}
                className="rounded-md text-xs"
              >
                {channel.monetized ? "Monetized" : "Not Monetized"}
              </Tag>
            </div>
          </div>
          {channel.mostDemanding && (
            <Tag color="gold" className="text-xs font-medium">
              ⭐ Hot Deal
            </Tag>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 text-center mb-2 border-t border-b py-2 text-gray-700">
          <Tooltip title="Subscribers">
            <div>
              <UserOutlined className="text-gray-500" />
              <p className="text-sm font-medium">
                {channel.subscriberCount?.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">Subs</p>
            </div>
          </Tooltip>
          <Tooltip title="Total Views">
            <div>
              <EyeOutlined className="text-gray-500" />
              <p className="text-sm font-medium">
                {channel.viewCount?.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">Views</p>
            </div>
          </Tooltip>
          <Tooltip title="Estimated Monthly Earnings">
            <div>
              <DollarOutlined className="text-gray-500" />
              <p className="text-sm font-medium">
                ${channel.estimatedEarnings?.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">Earnings</p>
            </div>
          </Tooltip>
        </div>

        {/* Extra Info */}
        <div className="flex flex-wrap justify-between mt-2 text-sm text-gray-600">
          <p>Videos: <span className="font-semibold">{channel.videoCount}</span></p>
          <p>Recent Views: <span className="font-semibold">{channel.recentViews?.toLocaleString()}</span></p>
        </div>

        {/* Price and CTA */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Asking Price</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{parseInt(channel.price).toLocaleString()}
            </p>
          </div>

          <Tooltip title="View on YouTube">
            <a
              href={channel.customUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 text-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <YoutubeOutlined />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
