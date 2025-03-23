import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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
      

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          {/* Page Header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-amber-500 pb-4">
            Terms of Usage
          </h1>

          {/* Content Sections */}
          <div className="space-y-8 text-gray-700">
            {/* Use License */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Use License</h2>
              <p className="mb-4 leading-relaxed">
                BBazaar Jewellery grant you permission to view and use this Site and to print individual pages...
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Non-commercial personal use only</li>
                <li>No modification or distribution of content</li>
                <li>Agreement to all terms and conditions</li>
              </ul>
            </section>

            {/* Product Orders */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Orders</h2>
              <div className="space-y-3">
                <p>• Product availability subject to change without notice</p>
                <p>• Right to limit quantities reserved</p>
                <p>• Prices valid in India only (INR)</p>
                <p>• Errors in pricing subject to correction</p>
              </div>
            </section>

            {/* Warranties */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">No Warranties</h2>
              <p className="mb-3 leading-relaxed">
                All materials provided 'As is' without any warranty...
              </p>
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                <p className="text-sm italic">
                  In no event shall BBazaar Jewellery be liable for any damages arising from site use
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacting Us</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <FiPhone className="text-amber-600 text-xl" />
                  <span>+91 6355268737</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-amber-600 text-xl" />
                  <a href="https://www.bbazaar.shop" className="hover:text-amber-700">
                    www.bbazaar.shop
                  </a>
                </div>
                <div className="flex gap-3">
                  <FiMapPin className="text-amber-600 text-xl mt-1 flex-shrink-0" />
                  <address className="not-italic">
                    301, 3rd Floor Ganesh Bhuvan Apartment,<br />
                    Near Ganesh colony, Opp Arihant Jewellers,<br />
                    Main Road Varachha, Surat, Gujarat - 395006
                  </address>
                </div>
              </div>
            </section>

            {/* Uploaded Content */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Content Guidelines</h2>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">By submitting content you agree:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You own all intellectual property rights</li>
                  <li>Content doesn't violate any laws</li>
                  <li>No viruses or malicious code</li>
                </ul>
                <p className="text-sm bg-red-50 p-3 rounded border-l-4 border-red-400">
                BBazaar Jewellery reserves right to modify/delete any user content
                </p>
              </div>
            </section>

            {/* General Terms */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Terms</h2>
              <div className="space-y-3">
                <p>• Governed by Gujarat State laws</p>
                <p>• Terms may change without notice</p>
                <p>• Entire agreement between parties</p>
                <p className="italic text-gray-600 mt-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;