import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

const GamingGadgets = () => {
  const products = [
    {
      id: 1,
      name: 'SocialSwap Headphones',
      description: 'Advanced noise-canceling gaming headphones with 7.1 surround sound, designed for crystal-clear communication and immersive audio experience',      price: 199.99,
      rating: 4.7,
      image: '/images/headphone.jpg'
    },
    {
      id: 2,
      name: 'SocialSwap Triggers',
      description: 'Precision gaming triggers with 16000 DPI optical sensor, customizable RGB lighting, and ergonomic design for enhanced gaming performance',      price: 89.99,
      rating: 4.5,
      image: '/images/trigger.png'
    },
    {
      id: 3,
      name: 'SocialSwap Mouse',
      description: 'High-performance gaming mouse featuring mechanical switches, adaptive RGB backlighting, and programmable buttons for ultimate gaming control',      price: 149.99,
      rating: 4.8,
      image: '/images/mouse2.png'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Gaming Gadgets</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-64 object-contain"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current'}`} 
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">({product.rating})</span>
                </div>
                
                <div className="text-xl font-bold text-gray-900">₹{product.price}</div>
              </div>
              
              <button 
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamingGadgets;