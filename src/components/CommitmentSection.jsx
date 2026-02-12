import React from 'react';

const CommitmentSection = () => {
  return (
    <section className="py-18 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center">
          <div className="bg-gray-50 rounded-3xl p-16">
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

export default CommitmentSection;
