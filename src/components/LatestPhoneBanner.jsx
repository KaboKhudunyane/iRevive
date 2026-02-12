import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LatestPhoneBanner = () => {
  const latestPhones = [
    {
      id: 1,
      name: 'iPhone 14 Plus',
      image: '/assets/iPhone14Plus Blue.jpg',
      price: 'R15999',
      specs: 'A15 Bionic, 128GB, Blue'
    },
    {
      id: 2,
      name: 'iPhone 13 Pro',
      image: '/assets/iPhone13Pro Gold.jpg',
      price: 'R14999',
      specs: 'A15 Bionic, 128GB, Gold'
    },
    {
      id: 3,
      name: 'iPhone 12',
      image: '/assets/iPhone12 Black.jpg',
      price: 'R12999',
      specs: 'A14 Bionic, 64GB, Black'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === latestPhones.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [latestPhones.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === latestPhones.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? latestPhones.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="relative bg-white text-black py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="w-1/2 pr-12">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight animate-fade-in">
              Latest iPhones
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-lg text-gray-600 leading-relaxed">
              Experience cutting-edge technology with our newest refurbished iPhones. Premium quality at unbeatable prices.
            </p>
            <div className="space-x-6">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 inline-block"
              >
                Shop Latest
              </Link>
              <Link
                to="/cart"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-400 transition-all duration-300 inline-block"
              >
                View Cart
              </Link>
            </div>
          </div>
          <div className="w-1/2 relative">
            <div className="relative h-[500px] overflow-hidden">
              {latestPhones.map((phone, index) => (
                <div
                  key={phone.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? 'translate-x-0 opacity-100'
                      : index < currentIndex
                      ? '-translate-x-full opacity-0'
                      : 'translate-x-full opacity-0'
                  }`}
                >
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-4 transition-all duration-300 border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-4 transition-all duration-300 border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {latestPhones.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestPhoneBanner;
