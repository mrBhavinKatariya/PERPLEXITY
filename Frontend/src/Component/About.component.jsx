import { motion } from 'framer-motion';
import { SparklesIcon, ShieldCheckIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';


const AboutUs = () => {
  const milestones = [
    { year: '2002', event: 'Founded in Mumbai' },
    { year: '2008', event: 'Opened 10th retail store' },
    { year: '2014', event: 'Launched online platform' },
    { year: '2023', event: '20+ stores nationwide' },
  ];

  const craftStats = [
    { id: 1, value: '200+', label: 'Skilled Artisans' },
    { id: 2, value: '10M+', label: 'Pieces Created' },
    { id: 3, value: '50+', label: 'Award-Winning Designs' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">

       {/* Navigation */}
    <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gold-500 to-gold-700 py-20">
  <div className="container mx-auto px-4 text-center">
    {/* Styled About Us heading */}
    <div className="mb-8 relative inline-block">
      <p className="font-cinzel text-2xl md:text-3xl uppercase tracking-wide mb-4 
         bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-black">
        About Us
      </p>
      <div className="absolute bottom-0 left-1/2 w-16 h-1 bg-gold-300 transform -translate-x-1/2"></div>
    </div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-4xl md:text-6xl font-cinzel font-bold text-black mb-6"
    >
      Crafting Timeless Elegance
    </motion.h1>
    
    <p className="text-xl text-gold-100 max-w-2xl mx-auto md:text-2xl md:leading-relaxed">
      Since 2002, India's premier destination for affordable luxury jewellery
    </p>
  </div>
</section>

      {/* Brand Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="img-2.e7422129.jpg" 
                alt="Craftsmanship" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-cinzel font-bold text-gray-800 mb-8">
                Our Heritage
              </h2>
              <p className="text-gray-600 mb-6">
                Established in 2002, BBAZAAR Jewellery has redefined India's fashion jewellery landscape 
                through unparalleled craftsmanship and accessible luxury. As the nation's largest 
                jewellery destination, we blend traditional artistry with contemporary design.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {milestones.map((item, index) => (
                  <div key={index} className="p-4 bg-gold-50 rounded-lg">
                    <div className="text-gold-700 font-bold">{item.year}</div>
                    <div className="text-gray-600 text-sm">{item.event}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <MapPinIcon className="h-6 w-6 text-gold-700" />
                <span className="text-gray-600">20+ Stores Across India</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 bg-gold-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <SparklesIcon className="h-16 w-16 text-gold-700 mx-auto mb-8" />
            <h2 className="text-3xl font-cinzel font-bold text-gray-800 mb-12">
              The BBAZAAR Difference
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {craftStats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="text-4xl font-bold text-gold-700 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <UserGroupIcon className="h-16 w-16 text-gold-700 mx-auto mb-8" />
              <h3 className="text-2xl font-cinzel font-bold text-gray-800 mb-6">
                Contemporary Narratives, Timeless Craft
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                We champion India's rare art forms through handcrafted masterpieces that 
                transcend fashion trends. Our collective of 200+ master artisans and 
                designers create exclusive pieces that marry lyrical aesthetics with 
                modern sensibilities.
              </p>
              <div className="flex justify-center space-x-6">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-gold-700 mr-2" />
                  <span className="text-gray-600">Quality Assurance</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-6 w-6 text-gold-700 mr-2" />
                  <span className="text-gray-600">Exclusive Designs</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;