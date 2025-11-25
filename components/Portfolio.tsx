export default function PortfolioSection() {
  const newsItems = [
    {
      img: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "मनोरञ्जन",
      title: "नेपाली चलचित्र 'प्रेमगीत' ले भर्ने गरेको सफलता",
      description: "हालै रिलिज भएको नेपाली चलचित्र 'प्रेमगीत' ले बक्स अफिसमा ठूलो सफलता हासिल गरेको छ। दर्शकहरूले यसको कथा, संगीत र प्रदर्शनलाई उच्च मूल्यांकन गरेका छन्। चलचित्रले सामाजिक सन्देशलाई मनोरञ्जनसँग मिसाएर प्रस्तुत गरेको छ।",
      time: "१ दिन अघि",
      reads: "२०० पटक पढिएको"
    },
    {
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "मनोरञ्जन",
      title: "नेपाली गीत संगीतमा नयाँ ट्रेन्ड",
      description: "संगीत प्रेमीहरूका लागि नेपाली गीतमा नयाँ शैलीको ट्रेन्ड सुरु भएको छ। यो शैलीले युवापुस्तालाई आकर्षित गर्दै छ र संगीत क्षेत्रमा नयाँ प्रयोगको मार्ग खोल्दै छ। धेरै गायिकाहरू र संगीतकारहरूले यसलाई समर्थन गरेका छन्।",
      time: "२ दिन अघि",
      reads: "३५० पटक पढिएको"
    },
    {
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "मनोरञ्जन",
      title: "नाटक मञ्चनमा युवा कलाकारहरूको योगदान",
      description: "स्थानीय नाटक मञ्चनमा युवा कलाकारहरूको महत्वपूर्ण योगदानले दर्शकहरूलाई आकर्षित गरेको छ। उनीहरूले आफ्नो प्रतिभा र समर्पण प्रस्तुत गर्दै सांस्कृतिक विविधता र कथा कथनको नयाँ ढाँचा प्रस्तुत गरेका छन्।",
      time: "३ दिन अघि",
      reads: "४५० पटक पढिएको"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            पोर्टफोलियो
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            नेपालको अग्रणी समाचार पोर्टलमा आफ्नो व्यवसायलाई प्रमोट गर्नुहोस्। 
            हामीसँग विभिन्न प्रकारका समाचार कार्डहरू उपलब्ध छन्।
          </p>
        </div>

        {/* News Cards */}
        <div className="space-y-8">
          {newsItems.map((item, index) => (
            <div 
              key={index} 
              className="group flex flex-col md:flex-row  rounded-xl overflow-hidden hover:text-red-600 transition-shadow duration-300"
            >
              {/* Image */}
              <div className="md:w-1/3 h-64 md:h-auto relative flex-shrink-0">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className=" object-contain"
                />
              </div>

          
              <div className="md:w-2/3 p-4 flex flex-col justify-between">
                <div className="">
               
                  <h3 className="mt-2 text-2xl font-bold text-gray-900 group-hover:text-red-500">{item.title}</h3>
                  <p className="mt-4 text-gray-700 text-base leading-relaxed group-hover:text-red-500">
                    {item.description}
                  </p>
                </div>

             
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
