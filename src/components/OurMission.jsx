import React from 'react';

const OurMission = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
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
      </div>
    </section>
  );
};

export default OurMission;
