import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative  bg-gradient-to-b from-gold-500 to-gold-700">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-cinzel mt-[20px] font-bold text-black mb-4"
          >
            Connect With Us
          </motion.h1>
          <p className="text-lg text-gold-100">
            We're here to help you with any inquiries or support needs
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <PhoneIcon className="h-8 w-8 text-gold-700 mr-4" />
                  <div>
                    <h3 className="text-2xl font-cinzel font-bold text-gray-800">Call & WhatsApp</h3>
                    <p className="text-gray-600">+91 73832 06760</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-6 w-6 text-gold-700 mr-4 ml-1" />
                  <p className="text-gray-600">Store hours: 09:00AM - 07:00 PM</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Call us for any kind of support. We'll provide effective resolution for any query.
                </p>
              </div>

              {/* Email Card */}
             {/* Email Card */}
<div className="bg-white p-8 rounded-xl shadow-lg">
  <div className="flex items-center mb-6">
    <EnvelopeIcon className="h-8 w-8 text-gold-700 mr-4" />
    <div>
      <h3 className="text-2xl font-cinzel font-bold text-gray-800">Email Us</h3>
      <a 
        href="mailto:care.bbazaar.shops@gmail.com" 
        className="text-gold-700 hover:text-gold-800 transition-colors"
      >
        care.wavelinastore@gmail.com
      </a>
    </div>
  </div>
  <p className="text-gray-600 text-sm mb-4">
    Average response time: 30 minutes
  </p>
 
</div>

              {/* Address Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <MapPinIcon className="h-8 w-8 text-gold-700 mr-4" />
                  <div>
                    <h3 className="text-2xl font-cinzel font-bold text-gray-800">Visit Us</h3>
                    <p className="text-gray-600">
                      87, chandralok soc,<br />
                      parvat patiya,<br />
                       Surat - 395010,<br />
                      Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg h-fit sticky top-8"
            >
              <h2 className="text-3xl font-cinzel font-bold text-gray-800 mb-8">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                  <button
                  type="submit"
                  className="w-full border-2 border-gold-600 text-gold-700 py-2 px-4 rounded-lg hover:bg-gold-50 transition-colors font-semibold text-sm"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;