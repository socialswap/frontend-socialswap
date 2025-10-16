import React from 'react';
import { Card, Carousel, Typography } from 'antd';
import { StarFilled, YoutubeFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const testimonials = [
  {
    name: "Aarav Singh",
    date: "2 months ago",
    content: "Selling my YouTube channel through SocialSwap was seamless. Shubham and his team handled everything with professionalism and transparency.",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/@ronislive18"
  },
  {
    name: "Young Mine",
    date: "1 month ago",
    content: "The buying process was incredibly smooth. Really happy with my purchase through SocialSwap!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@younggamer05"
  },
  {
    name: "Anubhav Mishra",
    date: "2 months ago",
    content: "Great experience selling my channel. The team was very professional throughout.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@anubhavdefender100k"
  },
  {
    name: "Yash Vegad",
    date: "1 month ago",
    content: "Buying on SocialSwap was easy and quick. Shubham guided me throughout the process.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@littlesingham755"
  },
  {
    name: "Shaurya Singh",
    date: "2 months ago",
    content: "The verification process made me feel secure in my purchase. Excellent service!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@shauryas_skits"
  },
  {
    name: "Ansh Chauhan",
    date: "1 month ago",
    content: "SocialSwap provided a secure platform for selling my channel. Very satisfied!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@ansh_edits108"
  },
  {
    name: "Sanket Chaudhari",
    date: "2 months ago",
    content: "Found exactly what I was looking for at a fair price. Transaction was smooth and secure.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@anime7x3"
  },
  {
    name: "Varun Sharma",
    date: "1 month ago",
    content: "Team SocialSwap made selling my channel stress-free. Their support was excellent!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@v2horror"
  },
  {
    name: "Anmol Verma",
    date: "3 months ago",
    content: "Excellent support throughout the entire buying process. Highly recommended!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@adgkingdom"
  },
  {
    name: "Sumit Patil",
    date: "2 months ago",
    content: "The selling process was transparent and professional. Great platform!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@gamingstargs19"
  },
  {
    name: "Mihir Patel",
    date: "1 month ago",
    content: "Very satisfied with my purchase. The team made everything easy and secure.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@daxua_playz"
  }
];

const TestimonialCard = ({ name, date, content, rating, youtubeUrl }) => (
  <Card 
    className="mx-2 h-full bg-white shadow-md hover:shadow-lg transition-all duration-300 relative"
    bordered={false}
  >
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <Title level={4} className="!mb-0">{name}</Title>
            <Text className="text-sm text-gray-500">{date}</Text>
          </div>
          <a 
            href={youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 transition-colors"
            style={{position:'absolute', right:'1rem', top:'1rem'}}
          >
            <YoutubeFilled className="text-2xl" />
          </a>
        </div>
        <div className="flex gap-0.5">
          {[...Array(rating)].map((_, i) => (
            <StarFilled key={i} className="text-yellow-400" />
          ))}
        </div>
      </div>
      <Text className="text-gray-700 leading-relaxed">{content}</Text>
    </div>
  </Card>
);

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="w-full py-16 bg-gray-50 Testimonials">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12">
          What Our Users Say
        </Title>
        <div className="relative testimonials-carousel">
          <style jsx>{`
            .testimonials-carousel .slick-dots li button {
              background: #D1D5DB;
            }
            .testimonials-carousel .slick-dots li.slick-active button {
              background: #4B5563;
            }
            .testimonials-carousel .slick-prev,
            .testimonials-carousel .slick-next {
              font-size: 24px;
              color: #4B5563;
            }
            .testimonials-carousel .slick-track {
              display: flex !important;
            }
            .testimonials-carousel .slick-slide {
              height: inherit !important;
              > div {
                height: 100%;
              }
            }
          `}</style>
          <Carousel {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="h-full px-2">
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;