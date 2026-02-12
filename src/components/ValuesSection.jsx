import React from 'react';

const ValuesSection = () => {
  const values = [
    {
      icon: '🔄',
      title: 'Sustainability',
      description: 'Reducing e-waste by refurbishing and reselling high-quality devices.'
    },
    {
      icon: '⭐',
      title: 'Quality Assurance',
      description: 'Rigorous testing and certification for every refurbished product.'
    },
    {
      icon: '💰',
      title: 'Affordable Luxury',
      description: 'Premium iPhone experience at a fraction of the original cost.'
    },
    {
      icon: '🚚',
      title: 'Fast Shipping',
      description: 'Quick and secure delivery to get your device to you ASAP.'
    }
  ];

  return (
    <section className="py-18 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-8 hover:bg-gray-50 transition-all duration-300 rounded-xl"
            >
              <div className="text-5xl mb-6">{value.icon}</div>
              <h4 className="text-2xl font-semibold text-black mb-4">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
