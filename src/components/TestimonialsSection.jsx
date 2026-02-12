import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      rating: 5,
      review: 'Absolutely thrilled with my refurbished iPhone 13! It looks and performs like brand new. iRevive\'s quality assurance is top-notch.',
      product: 'iPhone 13 Pro'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: '👨‍💻',
      rating: 5,
      review: 'Saved so much money on a premium device. The battery life is incredible and the camera quality is stunning. Highly recommend!',
      product: 'iPhone 12'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: '👩‍🎨',
      rating: 5,
      review: 'The customer service was exceptional. They answered all my questions and the delivery was super fast. Will definitely buy again.',
      product: 'iPhone 14 Plus'
    },
    {
      id: 4,
      name: 'David Thompson',
      avatar: '👨‍🔧',
      rating: 5,
      review: 'As a tech enthusiast, I was skeptical about refurbished phones, but this exceeded my expectations. Perfect condition!',
      product: 'iPhone 11 Pro'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what thousands of satisfied customers have to say about their iRevive experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-8 hover:bg-gray-50 transition-all duration-300 rounded-xl"
            >
              <div className="flex items-center mb-6">
                <div className="text-6xl mr-6">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-black text-xl">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.product}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 italic leading-relaxed">"{testimonial.review}"</p>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default TestimonialsSection;
