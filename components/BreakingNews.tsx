"use client";

export default function BreakingNews() {
  return (
    <div>
      <div className="bg-red-600 text-white py-5 overflow-hidden">
        <div className="flex items-center">
          <span className="bg-white text-red-600 px-3 py-1 rounded font-bold mr-4">
            ताजा समाचार
          </span>
          <div className="breaking-news whitespace-nowrap overflow-hidden">
            <span className="inline-block animate-marquee">
              प्रधानमन्त्रीको नयाँ कार्यक्रम घोषणा • विद्युत् आपूर्तिमा सुधार •
              राष्ट्रिय लिगको तयारी सकियो • काठमाडौंमा ट्राफिक व्यवस्थापन सुधार
              योजना सुरु •
            </span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto py-2">
        <h2 className="text-xl font-bold text-red-600 mb-4 border-b-4 border-red-600 inline-block pb-1">
          आजको मुख्य समाचार
        </h2>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="मुख्य समाचार"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="lg:w-1/2 p-4 flex flex-col justify-center">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              प्रधानमन्त्रीले राष्ट्रिय विकास कार्यक्रम घोषणा गर्दै आर्थिक
              सुधारमा जोड
            </h3>
            <p className="text-gray-600 leading-relaxed">
              प्रधानमन्त्रीले आज संसदमा सम्बोधन गर्दै नयाँ आर्थिक तथा विकास
              योजना सार्वजनिक गरेका छन्। उनले आगामी वर्षभित्र देशलाई ऊर्जा
              आत्मनिर्भर बनाउने र शिक्षा, स्वास्थ्य क्षेत्रमा सुधार ल्याउने
              प्रतिवद्धता व्यक्त गरे।
            </p>
            <button className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-fit">
              थप पढ्नुहोस् →
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
