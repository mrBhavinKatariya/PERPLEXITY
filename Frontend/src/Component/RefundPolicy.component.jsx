import { motion } from 'framer-motion';
import { CubeIcon, CreditCardIcon, TruckIcon, ClockIcon, DocumentIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { FaShippingFast, FaClock, FaBoxOpen, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { FiArrowLeft, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';
import { FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-cream-50">

<div className="text-center mb-16">

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


          <div className="inline-block bg-gradient-to-r mt-[20px] from-indigo-600 to-blue-500 p-3 rounded-lg mb-6">
            <FiDollarSign  className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Refund  Policy
          </h1>
        </div>
        
      {/* Hero Section */}
      <section className="relative  bg-gradient-to-b from-gold-500 to-gold-700">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4"
          >
            Return & Refund Policy
          </motion.h1>
          <p className="text-lg text-gold-100 mt-[-100px]">
            Your Satisfaction is Our Priority
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-gray-600 leading-relaxed"
          >
            <p className="mb-6 text-xl">
              Thank you for shopping at BBazaar Jewellery. If, for any reason, You are not completely 
              satisfied with a purchase We invite You to review our policy on refunds and returns.
            </p>
            <p className="text-lg">
              The following terms are applicable for any products that You purchased with Us.
            </p>
          </motion.div>

          {/* Definitions Section */}
          <PolicySection
            icon={<DocumentIcon className="h-8 w-8 text-gold-600" />}
            title="Interpretation and Definitions"
            content={
              <div className="space-y-6">
                <div className="bg-gold-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Interpretation:</p>
                  <p className="text-sm text-gray-600">
                    The words of which the initial letter is capitalized have meanings defined 
                    under specific conditions. These definitions shall apply regardless of their 
                    grammatical form.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <DefinitionItem 
                    term="Company" 
                    definition="BBazaar Jewellery, 301, 3rd Floor Ganesh Bhuvan Apartment, Near Ganesh Colony, Opp Arihant Jewelers, Main Road Varachha, Surat, Gujarat, India - 395006" 
                  />
                  <DefinitionItem term="Goods" definition="Items offered for sale" />
                  <DefinitionItem term="Orders" definition="A request to purchase Goods from Us" />
                  <DefinitionItem term="Website" definition="www.bbazaar.shop" />
                  <DefinitionItem term="You" definition="The individual or entity accessing our Service" />
                </div>
              </div>
            }
          />

          {/* Refund Policy */}
          <PolicySection
            icon={<CreditCardIcon className="h-8 w-8 text-gold-600" />}
            title="Refund Policy"
            content={
              <div className="space-y-4">
                <PolicyPoint 
                  title="Refund Credits" 
                  content="Refunds will be credited to your website/app wallet only after we receive and review your return parcel" 
                />
                <PolicyPoint 
                  title="Full Order Returns" 
                  content="Only complete orders can be returned. Partial returns are strictly not accepted" 
                />
                <PolicyPoint 
                  title="Box Opening Video" 
                  content="Mandatory video required to verify item condition for return processing" 
                />
              </div>
            }
          />

          {/* Shipping Charges */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-green-50 p-6 rounded-xl border-2 border-green-200"
            >
              <div className="flex items-center mb-4">
                <TruckIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold">Company-Paid Returns</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Applies to items that are damaged, defective, or incorrectly shipped
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-red-50 p-6 rounded-xl border-2 border-red-200"
            >
              <div className="flex items-center mb-4">
                <TruckIcon className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold">Customer-Paid Returns</h3>
              </div>
              <p className="text-gray-600 text-sm">
                All other return reasons including change of mind or incorrect size selection
              </p>
            </motion.div>
          </div>

          {/* Other Policies */}
          <PolicySection
            icon={<ClockIcon className="h-8 w-8 text-gold-600" />}
            title="Return Policies"
            content={
              <div className="space-y-4">
                <PolicyPoint 
                  title="7-Day Return Window" 
                  content="Returns must be initiated within 7 days of delivery date" 
                />
                <PolicyPoint 
                  title="Original Condition" 
                  content="Items must be returned with all original packaging, tags, and accessories intact" 
                />
                <PolicyPoint 
                  title="Processing Time" 
                  content="5-7 business days for processing after receiving returned items" 
                />
              </div>
            }
          />

          {/* Return Process */}
          <PolicySection
            icon={<CubeIcon className="h-8 w-8 text-gold-600" />}
            title="Returning Goods"
            content={
              <div className="space-y-4">
                <p className="text-gray-600">
                  You are responsible for the cost and risk of returning Goods to us. 
                  Recommended shipping methods:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Insured shipping service</li>
                  <li>Trackable mail service</li>
                  <li>Proper packaging to prevent damage</li>
                </ul>
                <p className="text-red-500 text-sm mt-4">
                  * We cannot process refunds without physical receipt of Goods or proof of delivery
                </p>
              </div>
            }
          />

          {/* Return Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg mb-12 border-2 border-gold-200"
          >
            <div className="flex items-center mb-4">
              <CubeIcon className="h-8 w-8 text-gold-600 mr-4" />
              <h2 className="text-2xl font-cinzel font-bold text-gray-800">
                Return Address
              </h2>
            </div>
            <address className="text-gray-600 not-italic leading-relaxed">
            92, Radhika Park soc,<br />
                      Near Polaris Mall,<br />
                      Puna gam, Surat - 395010,<br />
                      Gujarat, India
            </address>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center border-t-2 border-gold-100 pt-12"
          >
            <h3 className="text-xl font-cinzel font-bold text-gray-800 mb-6">
              Contact Us
            </h3>
            <div className="space-y-2">
              <a 
                href="mailto:care.bbazaar.shops@gmail.com" 
                className="text-gold-700 hover:text-gold-800 flex items-center justify-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                care.bbazaar.shops@gmail.com
              </a>
              <a 
                href="https://www.bbazaar.shop" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gold-700 hover:text-gold-800"
              >
                www.bbazaar.shop
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Reusable Components
const PolicySection = ({ icon, title, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="bg-white p-8 rounded-xl shadow-lg mb-12"
  >
    <div className="flex items-start mb-6">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-4">
        <h2 className="text-2xl font-cinzel font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600 leading-relaxed">{content}</div>
      </div>
    </div>
  </motion.div>
);

const DefinitionItem = ({ term, definition }) => (
  <div className="bg-gold-50 p-4 rounded-lg">
    <dt className="font-semibold text-gold-700">{term}</dt>
    <dd className="text-gray-600 text-sm mt-1">{definition}</dd>
  </div>
);

const PolicyPoint = ({ title, content }) => (
  <div className="flex items-start">
    <div className="h-6 w-6 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center mr-4">
      ✓
    </div>
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm">{content}</p>
    </div>
  </div>
);

export default RefundPolicyPage;