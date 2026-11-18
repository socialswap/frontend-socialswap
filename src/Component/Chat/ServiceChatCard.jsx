import React from 'react';
import { useNavigate } from 'react-router-dom';

// Clickable service preview shown inside a chat bubble. `service` is the populated message.serviceId.
const ServiceChatCard = ({ service }) => {
  const navigate = useNavigate();
  if (!service || typeof service !== 'object') return null;

  const image = service.images?.[0];
  const price = Number(service.price);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => service.slug && navigate(`/services/${service.slug}`)}
      onKeyDown={(e) => e.key === 'Enter' && service.slug && navigate(`/services/${service.slug}`)}
      className="mt-3 p-3 bg-white dark:bg-[#18112e] rounded-xl border border-purple-200 dark:border-purple-800/40 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      {image ? (
        <img src={image} loading="lazy" decoding="async" className="w-16 h-16 rounded-lg object-cover shrink-0" alt={service.serviceName} />
      ) : (
        <div className="w-16 h-16 rounded-lg shrink-0 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white truncate">{service.serviceName || 'Service'}</h4>
        <p className="text-[10px] md:text-[11px] text-gray-600 dark:text-gray-300 mt-1 truncate">
          {service.category ? `${service.category} • ` : ''}Service
        </p>
        {Number.isFinite(price) && (
          <p className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 mt-1">₹{price.toLocaleString('en-IN')}</p>
        )}
      </div>
    </div>
  );
};

export default ServiceChatCard;
