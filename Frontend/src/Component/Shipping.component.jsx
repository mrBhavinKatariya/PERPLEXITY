import { FaShippingFast, FaClock, FaBoxOpen, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';


const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-7xl mx-auto mt-[20px]">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-indigo-600 to-blue-500 p-3 rounded-lg mb-6">
            <FaShippingFast className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Shipping Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We strive to provide you with the best possible shopping experience with transparent shipping processes
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12">
          {/* Shipping Processing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaBoxOpen className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Order Processing</h2>
            </div>
            <div className="prose text-gray-600 max-w-none">
              <p className="mb-4">
                We aim to dispatch your order within <span className="font-semibold text-indigo-600">24-48 hours</span> of receiving it. 
                Dispatch times may vary depending on the product and order time.
              </p>
              <p>
                You'll receive regular updates about your order status and any potential delays.
              </p>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaClock className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Timeline</h2>
            </div>
            <div className="prose text-gray-600 max-w-none">
              <p className="mb-4">
                Standard delivery time is <span className="font-semibold">5-8 working days</span> from dispatch date. 
                Please note:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery times may vary based on location</li>
                <li>Saturday, Sunday, and Public holidays excluded</li>
                <li>Unexpected delays will be communicated promptly</li>
              </ul>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaShippingFast className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Shipping Charges</h2>
            </div>
            <div className="prose text-gray-600 max-w-none">
              <p>
                Enjoy <span className="font-semibold text-indigo-600">FREE shipping</span> on all orders above ₹399. 
                For orders below this amount, any applicable shipping charges will be clearly 
                displayed during checkout.
              </p>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaExclamationTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Special Circumstances</h2>
            </div>
            <div className="prose text-gray-600 max-w-none">
              <p>
                In case of unforeseen circumstances like adverse weather conditions or 
                transportation disruptions, delivery timelines might extend. We:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Will promptly notify you of any delays</li>
                <li>Provide updated delivery estimates</li>
                <li>Offer full support for urgent requirements</li>
              </ul>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaInfoCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Important Note</h3>
            </div>
            <p className="text-gray-600">
              Our working days exclude Saturdays, Sundays, and Public Holidays. 
              All delivery timelines are calculated based on working days only.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
          <p className="mb-6">Our support team is available to help with any shipping queries</p>
          <a 
            href="/contactus" 
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg 
                      font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;