import { motion } from 'framer-motion';
import { ShieldCheckIcon, DocumentTextIcon, LockClosedIcon, TrashIcon, CogIcon, CreditCardIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { FiArrowLeft, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';
import { FiFileText } from 'react-icons/fi';


import { Link } from 'react-router-dom';


const PrivacyPolicyPage = () => {
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

      <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r mt-[20px] from-indigo-600 to-blue-500 p-3 rounded-lg mb-6">
                  <FiFileText className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  Privacy Policy
                </h1>
               
              </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gold-500 to-gold-700">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-cinzel font-bold text-white "
          >
            Privacy Policy
          </motion.h1>
          <p className="text-lg text-gold-100 mt-[-80px]">
            Your Trust Means Everything to Us
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
            <p className="mb-6 mt-[-20px]">
              At BBazaar Jewellery, accessible from www.bbazzar.shop, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BBazaar Jewellery and how we use it.
            </p>
            <p className="mb-6">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in BBazaar Jewellery. This policy is not applicable to any information collected offline or via channels other than this website.
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-12">
            {/* Consent Section */}
            <PolicySection
              icon={<ShieldCheckIcon className="h-8 w-8 text-gold-600" />}
              title="Consent"
              content="By using our website, you hereby consent to our Privacy Policy and agree to its terms."
            />

            {/* Information Collection */}
            <PolicySection
              icon={<UserIcon className="h-8 w-8 text-gold-600" />}
              title="Information We Collect"
              content={
                <div className="space-y-4">
                  <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>Contact information (name, company name, address, email, phone number) during registration</li>
                    <li>Communication data when you contact us directly</li>
                    <li>Mandatory signup/login to access business-sensitive data (prices, designs, product details)</li>
                    <li>Message content and attachments when you communicate with us</li>
                  </ul>
                </div>
              }
            />

            {/* App Permissions */}
            <PolicySection
              icon={<LockClosedIcon className="h-8 w-8 text-gold-600" />}
              title="App Permissions"
              content={
                <div className="space-y-4">
                  <PermissionItem 
                    title="File Read/Write" 
                    detail="To download product images"
                  />
                  <PermissionItem 
                    title="Notifications" 
                    detail="For new product arrival alerts"
                  />
                  <PermissionItem 
                    title="Photo Library Access" 
                    detail="To share product photos"
                  />
                </div>
              }
            />

            {/* Payment Policy */}
            <PolicySection
              icon={<CreditCardIcon className="h-8 w-8 text-gold-600" />}
              title="Payment Security"
              content={
                <div className="space-y-4">
                  <p>We use third-party payment gateway services to collect payments. We never store:</p>
                  <ul className="list-disc pl-6">
                    <li>Bank account details</li>
                    <li>Credit/Debit card information</li>
                    <li>Any other financial data</li>
                  </ul>
                </div>
              }
            />

            {/* Information Usage */}
            <PolicySection
              icon={<ChartBarIcon className="h-8 w-8 text-gold-600" />}
              title="How We Use Your Information"
              content={
                <ul className="list-disc pl-6 space-y-3">
                  <li>Provide, operate, and maintain our website</li>
                  <li>Improve, personalize, and expand our services</li>
                  <li>Analyze user behavior and preferences</li>
                  <li>Develop new products and features</li>
                  <li>Communicate for customer service and marketing</li>
                  <li>Fraud prevention and security</li>
                </ul>
              }
            />

            {/* Log Files */}
            <PolicySection
              icon={<DocumentTextIcon className="h-8 w-8 text-gold-600" />}
              title="Log Files"
              content={
                <div className="space-y-4">
                  <p>BBazaar Jewellery follows standard log file procedures. Information collected includes:</p>
                  <ul className="list-disc pl-6">
                    <li>IP addresses</li>
                    <li>Browser type and version</li>
                    <li>Internet Service Provider (ISP)</li>
                    <li>Date/time stamps</li>
                    <li>Referring/exit pages</li>
                    <li>Click patterns</li>
                  </ul>
                  <p className="text-sm text-gray-500">This data is not linked to personally identifiable information.</p>
                </div>
              }
            />

            {/* Cookies */}
            <PolicySection
              icon={<CogIcon className="h-8 w-8 text-gold-600" />}
              title="Cookies & Web Beacons"
              content={
                <div className="space-y-4">
                  <p>We use cookies to:</p>
                  <ul className="list-disc pl-6">
                    <li>Store visitor preferences</li>
                    <li>Track user navigation patterns</li>
                    <li>Optimize website experience</li>
                    <li>Personalize content based on browser type</li>
                  </ul>
                </div>
              }
            />

            {/* Data Deletion */}
            <div className="bg-gradient-to-br from-gold-50 to-cream-50 p-8 rounded-xl shadow-lg">
              <div className="flex items-start mb-6">
                <TrashIcon className="h-8 w-8 text-gold-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-cinzel font-bold text-gray-800 mb-4">
                    How to Delete Your Data
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      At BBazaar Jewellery, we are committed to ensuring your privacy and providing control over your personal data. To comply with app store policies and enhance transparency:
                    </p>
                    <StepItem number="1" title="Open BBazaar Jewellery App" detail="Launch the application on your device"/>
                    <StepItem number="2" title="Navigate to Profile" detail="Find profile section via top-left menu icon"/>
                    <StepItem number="3" title="Find Delete Data Option" detail="Located at bottom of profile screen"/>
                    <StepItem number="4" title="Confirm Deletion" detail="Follow on-screen prompts to complete"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 text-center border-t-2 border-gold-100 pt-12"
          >
            <h3 className="text-xl font-cinzel font-bold text-gray-800 mb-4">
              Need More Information?
            </h3>
            <a 
              href="mailto:care.bbazaar.shops@gmail.com" 
              className="text-gold-700 hover:text-gold-800 transition-colors text-lg"
            >
              care.bbazaar.shops@gmail.com
            </a>
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
    className="bg-white p-8 rounded-xl shadow-lg"
  >
    <div className="flex items-start mb-6">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-4">
        <h2 className="text-2xl font-cinzel font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-4">{content}</div>
      </div>
    </div>
  </motion.div>
);

const PermissionItem = ({ title, detail }) => (
  <div className="border-l-4 border-gold-200 pl-4">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <p className="text-gray-600 text-sm">{detail}</p>
  </div>
);

const StepItem = ({ number, title, detail }) => (
  <div className="flex items-start">
    <div className="h-8 w-8 bg-gold-600 text-white rounded-full flex items-center justify-center mr-4 mt-1">
      {number}
    </div>
    <div>
      <span className="text-gray-800 font-medium block">{title}</span>
      {detail && <p className="text-gray-600 text-sm mt-1">{detail}</p>}
    </div>
  </div>
);

export default PrivacyPolicyPage;