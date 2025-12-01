"use client";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialMedia = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="w-full">
      <div className="bg-gray-100 border-t border-gray-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-600">नेपाल समाचार</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                नेपालको प्रमुख समाचार पोर्टल। तपाईंलाई दिनभरको महत्वपूर्ण
                समाचार, विश्लेषण र अपडेटहरू।
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">सम्पर्क</h3>

              <div className="flex flex-col space-y-3">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">काठमाडौँ, नेपाल</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-red-600 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    info@nepalsamachar.com
                  </span>
                </div>

                {/* Phone (always below email ✅) */}
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-red-600 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">+९७७-१-४२३४५६७</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">सामाजिक संजाल</h3>

              <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-3">
                {socialMedia.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="hidden md:inline text-sm">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-600 text-white px-2">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
            <p className="text-sm md:text-lg">
              © {currentYear} नेपाल समाचार. सर्वाधिकार सुरक्षित।
            </p>

            <p className="text-xs leading-relaxed">
              यस वेबसाइटको सम्पूर्ण सामग्री प्रकाशित वा प्रसारण गर्न लिखित
              अनुमति आवश्यक छ।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
