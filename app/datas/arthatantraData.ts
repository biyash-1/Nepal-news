export const arthatantraCategories = [
 
  { key: "banking", label: "बैङ्किङ्ग" },
  { key: "market", label: "बजार" },
  { key: "jobs", label: "रोजगारी" },
  { key: "trade", label: "व्यापार" },
  { key: "policy", label: "अर्थतन्त्र नीति" },
];

export interface ArthatantraNews {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  time: string;
  reads: string;
  category: string;
  author?: string;
}

export const arthatantraData: Record<string, ArthatantraNews[]> = {

  // ----------------- BANKING -----------------
  banking: [
    {
      id: 1,
      title: "बैंकहरूले बढाए ब्याज दर",
      description: "वाणिज्य बैंकहरूले ब्याज दरमा वृद्धि गरेका छन्।",
      content: "नेपाल राष्ट्र बैंकको नीतिअनुसार बैंकहरूले ब्याज दर समायोजन गरेका छन्...",
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938",
      time: "२ घन्टा अघि",
      reads: "१२,०००",
      category: "banking",
      author: "रमेश अधिकारी",
    },
    {
      id: 2,
      title: "डिजिटल बैंकिङ सेवा विस्तार",
      description: "नयाँ डिजिटल बैंकिङ सेवा सुरु।",
      content: "ग्राहकहरूले घरबाटै बैंकिङ गर्न सक्नेछन्...",
      image: "https://images.unsplash.com/photo-1605902711622-cfb43c44367e",
      time: "१ दिन अघि",
      reads: "८,५००",
      category: "banking",
      author: "सीता श्रेष्ठ",
    },
    {
      id: 3,
      title: "मोबाइल बैङ्किङ प्रयोगमा वृद्धि",
      description: "मोबाइल बैंकिङ प्रयोगकर्ताको संख्या बढेको छ।",
      content: "नेपाली बैंकहरूले मोबाइल बैंकिङ सेवा अझ प्रभावकारी बनाएका छन्...",
      image: "https://images.unsplash.com/photo-1550565118-3a14e094f0c5",
      time: "३ दिन अघि",
      reads: "६,२००",
      category: "banking",
      author: "मिना गुरुङ",
    },
    {
      id: 4,
      title: "फिनटेक कम्पनीहरूको विस्तार",
      description: "फिनटेक सेवामा तीव्र प्रतिस्पर्धा।",
      content: "डिजिटल पेमेन्ट सेवा प्रदान गर्ने कम्पनीहरूको संख्या बढ्दै गएको छ...",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      time: "५ दिन अघि",
      reads: "९,७००",
      category: "banking",
      author: "दिलीप कोइराला",
    },
  ],

  // ----------------- MARKET -----------------
  market: [
    {
      id: 1,
      title: "शेयर बजारमा उछाल",
      description: "यस हप्ता बजारमा तीव्र उछाल।",
      content: "बैंकिङ र वित्तिय कम्पनीहरूको शेयरमा विशेष वृद्धि...",
      image: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9",
      time: "४ घन्टा अघि",
      reads: "१५,२००",
      category: "market",
      author: "हरी प्रसाद",
    },
    {
      id: 2,
      title: "सुनको भाउमा गिरावट",
      description: "अन्तर्राष्ट्रिय बजारले असर पारेको छ।",
      content: "स्थानीय बजारमा सुनको भाउ घटेको छ...",
      image: "https://images.unsplash.com/photo-1604956373033-95d81c66a8b2",
      time: "२ दिन अघि",
      reads: "९,८००",
      category: "market",
      author: "गीता खड्का",
    },
    {
      id: 3,
      title: "इन्धन भाउ स्थिर",
      description: "नेपाल तेल निगमले भाउ परिवर्तन नगरेको घोषणा।",
      content: "विगत तीन हप्ता देखि इन्धन भाउ जस्ताको तस्तै छ...",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
      time: "१ दिन अघि",
      reads: "७,५००",
      category: "market",
      author: "शिव राज",
    },
    {
      id: 4,
      title: "खाद्य पदार्थको मूल्यवृद्धि",
      description: "तरकारीदेखि चामलसम्म भाउ बढेको रिपोर्ट।",
      content: "थोक बजारमा आपूर्तिका समस्याले मूल्य बढेको हो...",
      image: "https://images.unsplash.com/photo-1585325701962-d059dc4f76f2",
      time: "५ घन्टा अघि",
      reads: "११,१००",
      category: "market",
      author: "सरस्वती ढुंगाना",
    },
  ],

  // ----------------- JOBS -----------------
  jobs: [
    {
      id: 1,
      title: "सरकारले ५००० पदमा भर्ना घोषणा",
      description: "विभिन्न मन्त्रालयमा ठूलो संख्यामा भर्ना।",
      content: "यस भर्नाले युवाहरूलाई अवसर मिल्नेछ...",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      time: "१ दिन अघि",
      reads: "२५,०००",
      category: "jobs",
      author: "विजय कुमार",
    },
    {
      id: 2,
      title: "विदेश रोजगार माग बढ्यो",
      description: "मलेसिया र कतारले नयाँ माग पठाए।",
      content: "विदेश जान इच्छुक कामदारहरूको चहलपहल बढेको छ...",
      image: "https://images.unsplash.com/photo-1485217988980-11786ced9454",
      time: "२ दिन अघि",
      reads: "१७,५००",
      category: "jobs",
      author: "अनिता तामाङ",
    },
    {
      id: 3,
      title: "आईटी क्षेत्रमा ३०० नयाँ जागिर",
      description: "टेक कम्पनीहरूले स्टाफ विस्तार गर्दै।",
      content: "नेपालमा IT उद्योग तीव्र रुपमा बढ्दैछ...",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093",
      time: "६ घन्टा अघि",
      reads: "१४,८००",
      category: "jobs",
      author: "कृपा श्रेष्ठ",
    },
    {
      id: 4,
      title: "निजी क्षेत्रमा तलब वृद्धि",
      description: "कर्मचारी तलबमा १२% वृद्धि।",
      content: "दुई वर्षपछि निजी संस्थाहरूले तलब समायोजन गरेका छन्...",
      image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd",
      time: "३ दिन अघि",
      reads: "९,९००",
      category: "jobs",
      author: "अनिल कार्की",
    },
  ],

  // ----------------- TRADE -----------------
  trade: [
    {
      id: 1,
      title: "भारतसँग नयाँ व्यापार सम्झौता",
      description: "दुवै देशले नयाँ सम्झौतामा हस्ताक्षर।",
      content: "व्यापार सहज बनाउने उद्देश्य...",
      image: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0",
      time: "३ दिन अघि",
      reads: "१२,३००",
      category: "trade",
      author: "राजेश पौडेल",
    },
    {
      id: 2,
      title: "चीनसँग व्यापार घाटा बढ्यो",
      description: "आयात बढ्दा घाटा बढेको रिपोर्ट।",
      content: "नेपालको व्यापार असन्तुलन अझै उच्च छ...",
      image: "https://images.unsplash.com/photo-1465447142348-e9952c393450",
      time: "१ दिन अघि",
      reads: "१०,८००",
      category: "trade",
      author: "कुमार थापा",
    },
    {
      id: 3,
      title: "निर्यात क्षेत्रमा सुधार",
      description: "कार्पेट र हर्बल उद्योगले राम्रो परिणाम।",
      content: "निर्यात वृद्धि भएको छ...",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      time: "७ घन्टा अघि",
      reads: "८,५००",
      category: "trade",
      author: "माधव भण्डारी",
    },
    {
      id: 4,
      title: "साना उद्योगलाई अनुदान",
      description: "सरकारले नयाँ अनुदान योजना ल्यायो।",
      content: "सूक्ष्म उद्यम प्रोत्साहन गर्न कार्यक्रम सुरु...",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
      time: "४ दिन अघि",
      reads: "७,९००",
      category: "trade",
      author: "रविना बोहरा",
    },
  ],

  // ----------------- POLICY -----------------
  policy: [
    {
      id: 1,
      title: "नयाँ आर्थिक नीति जारी",
      description: "कृषि, उद्योग र सेवा प्रमुख प्राथमिकता।",
      content: "सरकारले आगामी वर्षको नीति सार्वजनिक गर्यो...",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      time: "१ हप्ता अघि",
      reads: "१८,९००",
      category: "policy",
      author: "डा. सुरेश थापा",
    },
    {
      id: 2,
      title: "कर संरचनामा परिवर्तन",
      description: "सरकारले कर दरमा केही परिमार्जन।",
      content: "आर्थिक दबाब घटाउन परिवर्तन गरिएको छ...",
      image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818",
      time: "४ दिन अघि",
      reads: "९,५००",
      category: "policy",
      author: "लक्ष्मण बस्नेत",
    },
    {
      id: 3,
      title: "२०७९/८० बजेट पुनरावलोकन",
      description: "बजेटमा केही महत्वपूर्ण संशोधन।",
      content: "कृषि अनुदान, स्वास्थ्य र शिक्षा क्षेत्रमा बढोत्तरी...",
      image: "https://images.unsplash.com/photo-1581091012184-5c7d28b0a3dd",
      time: "५ दिन अघि",
      reads: "७,०००",
      category: "policy",
      author: "कञ्चन पौडेल",
    },
    {
      id: 4,
      title: "विदेश लगानी नीतिमा सुधार",
      description: "एनआरएन र विदेशी लगानीकर्तालाई सहजता।",
      content: "नयाँ नीति लागू भएपछी लगानीमैत्री वातावरण...",
      image: "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2",
      time: "३ दिन अघि",
      reads: "६,८००",
      category: "policy",
      author: "प्रकाश अधिकारी",
    },
  ],
};

export const getAllArthatantraNews = () => {
  return Object.values(arthatantraData).flat();
};
