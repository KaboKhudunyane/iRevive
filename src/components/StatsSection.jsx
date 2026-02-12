import React from 'react'

const StatsSection = () => {
  const stats = [
    { label: 'Happy Customers', value: '100+' },
    { label: 'Products Sold', value: '250+' },
    { label: 'Years of Service', value: '2+' },
    { label: 'Satisfaction Rate', value: '98%' }
  ]

  return (
<section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
