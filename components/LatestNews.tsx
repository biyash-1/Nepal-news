export default function LatestNews() {
  const newsItems = [
    {
      img: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "शिक्षा",
      title: "विद्यालय स्तरमा नयाँ पाठ्यक्रम लागू",
      description: "आगामी शैक्षिक सत्रदेखि विद्यालय स्तरमा नयाँ पाठ्यक्रम लागू गर्ने तयारी भइरहेको छ।",
      time: "१० घण्टा अघि",
      reads: "८० पटक पढिएको"
    },
    {
      img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "प्रविधि", 
      title: "नेपालमा 5G प्रविधिको सुरुवात",
      description: "नेपालमा 5G प्रविधिको सुरुवात गर्ने तयारी भइरहेको छ।",
      time: "१२ घण्टा अघि", 
      reads: "१२० पटक पढिएको"
    },
    {
      img: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "मनोरञ्जन",
      title: "नेपाली चलचित्र 'प्रेमगीत' ले भर्ने गरेको सफलता", 
      description: "हालै रिलीज भएको नेपाली चलचित्र 'प्रेमगीत' ले बक्स अफिसमा ठूलो सफलता हासिल गरेको छ।",
      time: "१ दिन अघि",
      reads: "२०० पटक पढिएको"
    }
  ]

  return (
    <section className="mb-10 py-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">ताजा समाचार</h2>
        <a href="#" className="text-red-600 font-medium flex items-center">
          सबै हेर्नुहोस्
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {newsItems.map((item, index) => (
    <div 
      key={index} 
      className="rounded-lg overflow-hidden news-card cursor-pointer group"
    >
      <img 
        src={item.img} 
        alt={item.title} 
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold mt-2 mb-2 text-gray-800 transition-colors duration-300 group-hover:text-red-600">
          {item.title}
        </h3>
      </div>
    </div>
  ))}
</div>

    </section>
  )
}