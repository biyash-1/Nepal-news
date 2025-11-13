export interface PradeshData {
  id: string;
  name: string;
  number: string;
  capital: string;
  area: string;
  population: string;
  districts: number;
  headquarters: string;
  majorCities: string[];
  geography: string;
  culture: string;
  economy: string;
  tourism: string[];
  image: string;
  mapImage?: string;
  chiefMinister?: string;
  governor?: string;
}

// Province news data structure
export interface PradeshNews {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  tags: string[];
  views: number;
  isBreaking: boolean;
}

export const pradeshData: { [key: string]: PradeshData } = {
  "1": {
    id: "1",
    name: "कोशी प्रदेश",
    number: "प्रदेश नं १",
    capital: "बिराटनगर",
    area: "25,905 km²",
    population: "49,61,412",
    districts: 14,
    headquarters: "बिराटनगर",
    majorCities: ["बिराटनगर", "धरान", "इटहरी", "इनरूवा", "धनकुटा"],
    geography: "कोशी प्रदेश हिमाल, पहाड, र तराई क्षेत्रमा फैलिएको छ। सगरमाथा विश्वको सर्वोच्च शिखर यसै प्रदेशमा पर्दछ।",
    culture: "यहाँ लिम्बु, राई, तामाङ, शेर्पा, नेवार लगायत विभिन्न जातजातिको समृद्ध सांस्कृतिक परम्परा रहेको छ।",
    economy: "कृषि, उद्योग, र पर्यटन प्रमुख आर्थिक आधार।",
    tourism: ["सगरमाथा", "मकालु बारुन राष्ट्रिय निकुञ्ज", "कोशी टप्पु वन्यजन्तु आरक्ष", "पाँचथरको टिनजुरे डाँडा", "इलामको चिया बगान"],
    image: "https://images.unsplash.com/photo-1544735716-2f8e3bf695b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/koshi-map.jpg",
    chiefMinister: "हिक्मत कार्की",
    governor: "पर्शुराम खपुङ्ग"
  },
  "2": {
    id: "2",
    name: "मधेश प्रदेश",
    number: "प्रदेश नं २",
    capital: "जनकपुरधाम",
    area: "9,661 km²",
    population: "54,04,145",
    districts: 8,
    headquarters: "जनकपुरधाम",
    majorCities: ["जनकपुर", "बिरगञ्ज", "गौर", "कलैया", "मलङ्वा"],
    geography: "मधेश प्रदेश समथर तराई क्षेत्रमा रहेको छ। यो प्रदेश भारतसँग जोडिएको सीमाना क्षेत्र हो।",
    culture: "मैथिली, भोजपुरी, बज्जिका संस्कृतिको केन्द्र। जनकपुर धाम हिन्दू धर्मका लागि महत्त्वपूर्ण तीर्थस्थल।",
    economy: "कृषिप्रधान अर्थतन्त्र, विशेष गरी धान, गहुँ, मकै, तोरी उत्पादन।",
    tourism: ["जनकपुर धाम", "बरदिबास", "बिरगञ्ज शहर", "सीतामढी मन्दिर", "गौर शहर"],
    image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/madhesh-map.jpg",
    chiefMinister: "सरोज कुमार यादव",
    governor: "हरि शंकर मिश्र"
  },
  "3": {
    id: "3",
    name: "बागमती प्रदेश",
    number: "प्रदेश नं ३",
    capital: "हेटौंडा",
    area: "20,300 km²",
    population: "61,56,942",
    districts: 13,
    headquarters: "हेटौंडा",
    majorCities: ["काठमाडौँ", "ललितपुर", "भक्तपुर", "हेटौंडा", "धुलिखेल"],
    geography: "बागमती प्रदेशमा हिमाल, पहाड, र उपत्यका क्षेत्र समेटिएको छ। काठमाडौँ उपत्यका यसै प्रदेशमा पर्दछ।",
    culture: "नेवार संस्कृतिको केन्द्र। काठमाडौँ उपत्यका युनेस्को विश्व सम्पदा क्षेत्र।",
    economy: "नेपालको आर्थिक राजधानी। पर्यटन, व्यापार, उद्योग, सेवा क्षेत्र विकसित।",
    tourism: ["काठमाडौँ दरबार क्षेत्र", "पशुपतिनाथ", "स्वयम्भूनाथ", "बौधनाथ", "पाटन दरबार", "भक्तपुर दरबार"],
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/bagmati-map.jpg",
    chiefMinister: "शालिकराम जामकट्टेल",
    governor: "यादवचन्द्र शर्मा"
  },
  "4": {
    id: "4",
    name: "गण्डकी प्रदेश",
    number: "प्रदेश नं ४",
    capital: "पोखरा",
    area: "21,504 km²",
    population: "24,73,246",
    districts: 11,
    headquarters: "पोखरा",
    majorCities: ["पोखरा", "वाग्लुङ", "स्याङ्जा", "गोरखा", "कास्की"],
    geography: "गण्डकी प्रदेश हिमाल र पहाडी क्षेत्रमा रहेको छ। अन्नपूर्ण हिमश्रृङ्खला, माछापुछ्रे जस्ता हिमालहरू यसै प्रदेशमा पर्दछन्।",
    culture: "गुरुङ, मगर, तामाङ जातिको बाहुल्यता। माछापुछ्रेको कुमारी देवीको पूजा।",
    economy: "पर्यटन र कृषि मुख्य आयको स्रोत। पोखरा नेपालको दोस्रो ठूलो पर्यटकीय गन्तव्य।",
    tourism: ["पोखरा", "साराङकोट", "बेगनास ताल", "माछापुछ्रे", "गोरखा दरबार", "मनकामना मन्दिर"],
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/gandaki-map.jpg",
    chiefMinister: "सूर्यबहादुर थापा",
    governor: "पृथ्वीमान गुरुङ"
  },
  "5": {
    id: "5",
    name: "लुम्बिनी प्रदेश",
    number: "प्रदेश नं ५",
    capital: "देवदह",
    area: "22,288 km²",
    population: "50,26,195",
    districts: 12,
    headquarters: "देवदह",
    majorCities: ["बुटवल", "नेपालगञ्ज", "तौलिहवा", "गुलरिया", "कपिलवस्तु"],
    geography: "लुम्बिनी प्रदेश तराई र चुरे पहाडी भेगमा रहेको छ। यो प्रदेश नेपालको भारतसँग जोडिएको महत्त्वपूर्ण व्यापारिक गलियारा हो।",
    culture: "गौतम बुद्धको जन्मस्थल। थारु, मगर, ब्राह्मण, क्षेत्री जातिको बसोबास।",
    economy: "कृषि र व्यापार मुख्य आयको स्रोत। बुटवल नेपालको प्रमुख व्यापारिक केन्द्र।",
    tourism: ["लुम्बिनी", "कपिलवस्तु", "तिलौराकोट", "बर्दाघाट", "सुनवल"],
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/lumbini-map.jpg",
    chiefMinister: "लिलादेवी पोखरेल",
    governor: "तिलकपरीयार"
  },
  "6": {
    id: "6",
    name: "कर्णाली प्रदेश",
    number: "प्रदेश नं ६",
    capital: "वीरेन्द्रनगर",
    area: "27,984 km²",
    population: "15,69,375",
    districts: 10,
    headquarters: "वीरेन्द्रनगर",
    majorCities: ["वीरेन्द्रनगर", "मान्मा", "जुम्ला", "दुल्लु", "चैनपुर"],
    geography: "कर्णाली प्रदेश पहाडी र हिमाली क्षेत्रमा रहेको छ। नेपालको सबैभन्दा लामो कर्णाली नदी यसै प्रदेशबाट बग्दछ।",
    culture: "ठकाली, मगर, ब्राह्मण, क्षेत्री जातिको बसोबास। स्थानीय भाषा, संस्कृति र परम्परा संरक्षित।",
    economy: "कृषि, पशुपालन, र पर्यटन मुख्य आयको स्रोत। रारा ताल पर्यटकीय आकर्षण।",
    tourism: ["रारा ताल", "शे-फोकसुन्डो राष्ट्रिय निकुञ्ज", "सिन्जा उपत्यका", "खप्तड राष्ट्रिय निकुञ्ज"],
    image: "https://images.unsplash.com/photo-1464822759849-deb49ff8aea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/karnali-map.jpg",
    chiefMinister: "राजकुमार शर्मा",
    governor: "तिलक बुढा"
  },
  "7": {
    id: "7",
    name: "सुदूरपश्चिम प्रदेश",
    number: "प्रदेश नं ७",
    capital: "गोडावरी",
    area: "19,539 km²",
    population: "29,26,905",
    districts: 9,
    headquarters: "गोडावरी",
    majorCities: ["धनगढी", "टिकापुर", "महेन्द्रनगर", "गोडावरी", "अत्तरिया"],
    geography: "सुदूरपश्चिम प्रदेश तराई, पहाड, र हिमाल तीनै भौगोलिक क्षेत्र समेटिएको छ।",
    culture: "डोटेली, कुमाउँनी, थारु संस्कृतिको मिश्रण। शैव र शाक्त परम्पराको प्रभाव।",
    economy: "कृषि र व्यापार मुख्य आयको स्रोत। धनगढी र महेन्द्रनगर व्यापारिक केन्द्र।",
    tourism: ["शुक्लाफाँट राष्ट्रिय निकुञ्ज", "खप्तड राष्ट्रिय निकुञ्ज", "बदलिका मन्दिर", "जोगबुदा"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    mapImage: "/images/maps/sudurpashchim-map.jpg",
    chiefMinister: "त्रिलोचन भट्ट",
    governor: "देवराज जोशी"
  }
};

// News data for each province with real, visible images
export const pradeshNewsData: { [key: string]: PradeshNews[] } = {
  "1": [
    {
      id: "1",
      title: "कोशी प्रदेशमा नयाँ औद्योगिक क्षेत्रको घोषणा, हजारौंलाई रोजगारीको सम्भावना",
      excerpt: "प्रदेश सरकारले बिराटनगरमा ५०० रोपनी क्षेत्रमा नयाँ औद्योगिक क्षेत्र स्थापना गर्ने योजना बनाएको छ।",
      content: "कोशी प्रदेश सरकारले बिराटनगर-इटहरी क्षेत्रमा नयाँ औद्योगिक क्षेत्र स्थापना गर्ने योजना बनाएको छ। यसले गर्दा प्रदेशमा हजारौं युवाहरूलाई रोजगारीको अवसर प्राप्त हुने सम्भावना छ।",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "आर्थिक",
      date: "२०८२ मंसिर २७",
      author: "रामेश्वर यादव",
      tags: ["औद्योगिक क्षेत्र", "रोजगारी", "बिराटनगर"],
      views: 2450,
      isBreaking: true
    },
    {
      id: "2",
      title: "सगरमाथा क्षेत्रमा बिस्तारै बढ्दै पर्यटक, होटलहरू पूर्ण क्षमतामा",
      excerpt: "हेमन्त ऋतुको सुरुवातसँगै सगरमाथा क्षेत्रमा पर्यटकहरूको संख्या बढेको छ।",
      content: "सगरमाथा क्षेत्रमा पर्यटकहरूको संख्या बढेको छ। स्थानीय होटल र लजहरू पूर्ण क्षमतामा चलिरहेका छन्।",
      image: "https://images.unsplash.com/photo-1544735716-2f8e3bf695b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "पर्यटन",
      date: "२०८२ मंसिर २६",
      author: "सुरेश राई",
      tags: ["सगरमाथा", "पर्यटन", "हेमन्त"],
      views: 1890,
      isBreaking: false
    },
    {
      id: "3",
      title: "धरानमा स्वास्थ्य सेवाको गुणस्तर सुधार्न नयाँ ५० शय्याको अस्पताल निर्माण",
      excerpt: "धरान उपमहानगरपालिकाले नयाँ ५० शय्याको आधुनिक अस्पताल निर्माण गर्ने योजना बनाएको छ।",
      content: "धरान उपमहानगरपालिकाले स्थानीय स्वास्थ्य सेवाको गुणस्तर सुधार्न नयाँ आधुनिक अस्पताल निर्माण गर्ने योजना बनाएको छ।",
      image: "https://images.unsplash.com/photo-1516549655669-df6654e447e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "स्वास्थ्य",
      date: "२०८२ मंसिर २५",
      author: "डा. सन्तोष थापा",
      tags: ["अस्पताल", "स्वास्थ्य", "धरान"],
      views: 1560,
      isBreaking: false
    },
    {
      id: "4",
      title: "मुख्यमन्त्री कार्कीको नयाँ मन्त्रीपरिषद्गठन, ३ नयाँ मन्त्री दर्ता",
      excerpt: "प्रदेश सरकारले गत साता तीन नयाँ मन्त्रीहरू दर्ता गरेको छ।",
      content: "कोशी प्रदेश सरकारले गत साता तीन नयाँ मन्त्रीहरू दर्ता गरेको छ। नयाँ मन्त्रीहरूले आफ्नो कार्यभार सम्हालेका छन्।",
      image: "https://images.unsplash.com/photo-1551135049-8a33b4273813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "राजनीति",
      date: "२०८२ मंसिर २४",
      author: "केशव पौडेल",
      tags: ["मन्त्रीपरिषद", "सरकार", "राजनीति"],
      views: 2100,
      isBreaking: true
    },
    {
      id: "5",
      title: "इलामको चिया बगानमा पर्यटकहरूको भिड बढेको",
      excerpt: "हेमन्त ऋतुको सुरुवातसँगै इलामको चिया बगानमा पर्यटकहरूको संख्या बढेको छ।",
      content: "इलामको चिया बगानमा पर्यटकहरूको संख्या बढेको छ। स्थानीय होटल र लजहरू पूर्ण क्षमतामा चलिरहेका छन्।",
      image: "https://images.unsplash.com/photo-1592409065737-253c808e0d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "पर्यटन",
      date: "२०८२ मंसिर २३",
      author: "अनिता राई",
      tags: ["इलाम", "चिया बगान", "पर्यटन"],
      views: 1670,
      isBreaking: false
    }
  ],
  "2": [
    {
      id: "6",
      title: "मधेश प्रदेशमा कृषि उत्पादनमा वृद्धि, रेकर्ड उत्पादनको सम्भावना",
      excerpt: "यस वर्ष मधेश प्रदेशमा कृषि उत्पादनमा ठूलो वृद्धि भएको छ।",
      content: "अनुकूल मौसम र सरकारी सहयोगले गर्दा मधेश प्रदेशमा कृषि उत्पादनमा ठूलो वृद्धि भएको छ।",
      image: "https://images.unsplash.com/photo-1621252171976-12af6ea4d2c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "कृषि",
      date: "२०८२ मंसिर २७",
      author: "हरिश्चन्द्र यादव",
      tags: ["कृषि", "उत्पादन", "मधेश"],
      views: 1780,
      isBreaking: false
    },
    {
      id: "7",
      title: "जनकपुर धाममा धार्मिक पर्यटनमा वृद्धि",
      excerpt: "जनकपुर धाममा धार्मिक पर्यटकहरूको संख्या बढेको छ।",
      content: "धार्मिक पर्यटनको लागि प्रसिद्ध जनकपुर धाममा पर्यटकहरूको संख्या बढेको छ।",
      image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "पर्यटन",
      date: "२०८२ मंसिर २६",
      author: "राधिका मिश्र",
      tags: ["जनकपुर", "धार्मिक पर्यटन", "धाम"],
      views: 1920,
      isBreaking: false
    },
    {
      id: "8",
      title: "बिरगञ्ज सीमा क्षेत्रमा व्यापारमा वृद्धि",
      excerpt: "बिरगञ्ज सीमा क्षेत्रमा नेपाल-भारत व्यापारमा वृद्धि भएको छ।",
      content: "बिरगञ्ज सीमा क्षेत्रमा नेपाल-भारत व्यापारमा वृद्धि भएको छ। व्यापारिक गतिविधिहरू बढेका छन्।",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "व्यापार",
      date: "२०८२ मंसिर २५",
      author: "विजय कुमार",
      tags: ["बिरगञ्ज", "व्यापार", "सीमा"],
      views: 1450,
      isBreaking: false
    }
  ],
  "3": [
    {
      id: "9",
      title: "बागमती प्रदेशमा नयाँ स्मार्ट सिटी परियोजना सुरु",
      excerpt: "बागमती प्रदेश सरकारले काठमाडौँ उपत्यकामा नयाँ स्मार्ट सिटी परियोजना सुरु गरेको छ।",
      content: "बागमती प्रदेश सरकारले काठमाडौँ उपत्यकामा नयाँ स्मार्ट सिटी परियोजना सुरु गरेको छ।",
      image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "विकास",
      date: "२०८२ मंसिर २७",
      author: "आशिष श्रेष्ठ",
      tags: ["स्मार्ट सिटी", "विकास", "काठमाडौँ"],
      views: 2650,
      isBreaking: true
    },
    {
      id: "10",
      title: "काठमाडौँ उपत्यकामा यातायात जामको समस्या बढ्दो",
      excerpt: "काठमाडौँ उपत्यकामा यातायात जामको समस्या दिनप्रतिदिन बढ्दै गएको छ।",
      content: "काठमाडौँ उपत्यकामा यातायात जामको समस्या दिनप्रतिदिन बढ्दै गएको छ। स्थानीय बासिन्दाहरूलाई ठूलो समस्या भोग्नुपरिरहेको छ।",
      image: "https://images.unsplash.com/photo-1475085042961-8b0d4e1f64c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "यातायात",
      date: "२०८२ मंसिर २६",
      author: "बिक्रम श्रेष्ठ",
      tags: ["यातायात", "जाम", "काठमाडौँ"],
      views: 1890,
      isBreaking: false
    }
  ],
  "4": [
    {
      id: "11",
      title: "गण्डकी प्रदेशमा पर्यटन उद्योगमा ठूलो उछाल",
      excerpt: "पोखरा र आसपासका पर्यटकीय स्थलहरूमा पर्यटकहरूको संख्या बढेको छ।",
      content: "गण्डकी प्रदेशमा पर्यटन उद्योगमा ठूलो उछाल आएको छ। पोखरा र आसपासका पर्यटकीय स्थलहरूमा पर्यटकहरूको संख्या बढेको छ।",
      image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "पर्यटन",
      date: "२०८२ मंसिर २७",
      author: "गणेश गुरुङ",
      tags: ["पोखरा", "पर्यटन", "गण्डकी"],
      views: 1980,
      isBreaking: false
    },
    {
      id: "12",
      title: "माछापुछ्रे क्षेत्रमा नयाँ ट्रेकिङ मार्ग खुल्ने",
      excerpt: "माछापुछ्रे क्षेत्रमा नयाँ ट्रेकिङ मार्ग खोल्ने योजना बनाइएको छ।",
      content: "माछापुछ्रे क्षेत्रमा नयाँ ट्रेकिङ मार्ग खोल्ने योजना बनाइएको छ। यसले गर्दा पर्यटकहरूलाई थप सहजता प्राप्त हुनेछ।",
      image: "https://images.unsplash.com/photo-1464822759849-deb49ff8aea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "पर्यटन",
      date: "२०८२ मंसिर २६",
      author: "सुरज गुरुङ",
      tags: ["माछापुछ्रे", "ट्रेकिङ", "पर्यटन"],
      views: 1670,
      isBreaking: false
    }
  ],
  "5": [
    {
      id: "13",
      title: "लुम्बिनी प्रदेशमा अन्तर्राष्ट्रिय बुद्ध सम्मेलनको आयोजना",
      excerpt: "लुम्बिनीमा अन्तर्राष्ट्रिय बुद्ध सम्मेलनको आयोजना गरिनेछ।",
      content: "लुम्बिनी प्रदेशमा अन्तर्राष्ट्रिय बुद्ध सम्मेलनको आयोजना गरिनेछ। विभिन्न देशहरूका प्रतिनिधिहरू सहभागी हुनेछन्।",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "धर्म",
      date: "२०८२ मंसिर २७",
      author: "भिक्खु धर्मरक्षित",
      tags: ["लुम्बिनी", "बुद्ध", "सम्मेलन"],
      views: 1760,
      isBreaking: false
    }
  ],
  "6": [
    {
      id: "14",
      title: "कर्णाली प्रदेशमा सडक जडानमा ठूलो अवरोध",
      excerpt: "बर्षाको कारण कर्णाली प्रदेशको सडक जडानमा ठूलो अवरोध उत्पन्न भएको छ।",
      content: "बर्षाको कारण कर्णाली प्रदेशको सडक जडानमा ठूलो अवरोध उत्पन्न भएको छ। स्थानीय बासिन्दाहरूलाई समस्या भोग्नुपरेको छ।",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "विकास",
      date: "२०८२ मंसिर २७",
      author: "बिरेन्द्र बोहोरा",
      tags: ["सडक", "जडान", "कर्णाली"],
      views: 1420,
      isBreaking: true
    }
  ],
  "7": [
    {
      id: "15",
      title: "सुदूरपश्चिम प्रदेशमा स्वास्थ्य सेवामा सुधार",
      excerpt: "सुदूरपश्चिम प्रदेशमा स्वास्थ्य सेवाको गुणस्तरमा सुधार भएको छ।",
      content: "सुदूरपश्चिम प्रदेशमा स्वास्थ्य सेवाको गुणस्तरमा सुधार भएको छ। नयाँ स्वास्थ्य केन्द्रहरू स्थापना गरिएका छन्।",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "स्वास्थ्य",
      date: "२०८२ मंसिर २७",
      author: "डा. सुनिल बिष्ट",
      tags: ["स्वास्थ्य", "सेवा", "सुदूरपश्चिम"],
      views: 1280,
      isBreaking: false
    }
  ]
};

// Trending news across all provinces
export const trendingProvinceNews = [
  {
    id: "1",
    title: "कोशी प्रदेशमा नयाँ औद्योगिक क्षेत्रको घोषणा",
    province: "कोशी",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    views: 2450
  },
  {
    id: "9",
    title: "बागमती प्रदेशमा स्मार्ट सिटी परियोजना",
    province: "बागमती",
    image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    views: 2650
  },
  {
    id: "2",
    title: "सगरमाथा क्षेत्रमा पर्यटक बढी",
    province: "कोशी",
    image: "https://images.unsplash.com/photo-1544735716-2f8e3bf695b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    views: 1890
  },
  {
    id: "6",
    title: "मधेशमा कृषि उत्पादनमा वृद्धि",
    province: "मधेश",
    image: "https://images.unsplash.com/photo-1621252171976-12af6ea4d2c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    views: 1780
  },
  {
    id: "11",
    title: "गण्डकीमा पर्यटन उद्योगमा उछाल",
    province: "गण्डकी",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    views: 1980
  }
];

export const allProvinces = Object.values(pradeshData);