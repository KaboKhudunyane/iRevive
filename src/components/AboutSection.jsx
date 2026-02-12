import React from 'react';

const AboutSection = () => {
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
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            About iRevive
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about giving premium iPhones a second life, making cutting-edge technology accessible to everyone while protecting our planet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h3 className="text-4xl font-bold text-black mb-8">Our Mission</h3>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At iRevive, we believe that technology should be sustainable, affordable, and accessible. Our mission is to bridge the gap between premium smartphone experiences and budget-conscious consumers by offering meticulously refurbished iPhones that perform like new.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every device in our inventory undergoes a comprehensive 50-point inspection, ensuring that you receive a product that's not just affordable, but truly reliable and high-performing.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl p-12">
              <div className="text-7xl mb-6">📱</div>
              <h4 className="text-3xl font-bold mb-6 text-black">Innovation Meets Sustainability</h4>
              <p className="text-xl text-gray-700 leading-relaxed">
                We're not just reselling phones – we're creating a sustainable future for technology consumption.
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-4xl font-bold text-black">10,000+</div>
              <div className="text-lg text-gray-600">Devices Refurbished</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
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

        <div className="text-center">
          <div className="bg-gray-50 rounded-3xl p-16 max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold text-black mb-12">Our Commitment to You</h3>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-6xl mb-6">🛡️</div>
                <h4 className="text-2xl font-semibold mb-4 text-black">1-Year Warranty</h4>
                <p className="text-lg text-gray-600 leading-relaxed">Comprehensive coverage on all refurbished devices</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-6">🔧</div>
                <h4 className="text-2xl font-semibold mb-4 text-black">Expert Support</h4>
                <p className="text-lg text-gray-600 leading-relaxed">24/7 customer service and technical assistance</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-6">💳</div>
                <h4 className="text-2xl font-semibold mb-4 text-black">Easy Returns</h4>
                <p className="text-lg text-gray-600 leading-relaxed">30-day return policy for your peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
