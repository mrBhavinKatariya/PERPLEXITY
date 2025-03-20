import React from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';


const PrivacyPolicy = () => {
    const navigate = useNavigate()

    
  return (
    
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
<button 
  onClick={() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/setting'); 
    }
  }}
  className="mb-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
>
  &larr; Back to Setting
</button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        
        <p className="mb-8 text-gray-600">
          This Privacy Policy describes Our policies and procedures on the collection, 
          use and disclosure of Your information when You use the Service and tells You 
          about Your privacy rights and how the law protects You.
        </p>

        {/* Interpretation and Definitions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interpretation and Definitions</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Interpretation</h3>
            <p className="text-gray-600">
              The words of which the initial letter is capitalized have meanings defined under the following conditions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Definitions</h3>
            <dl className="grid gap-4">
              {[
                { term: 'You', definition: 'means the individual accessing or using the Service...' },
                { term: 'Company', definition: 'refers to Mantri Malls' },
                // Add all other definitions here
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-blue-100 pl-4">
                  <dt className="font-medium text-gray-700">{item.term}</dt>
                  <dd className="text-gray-600 mt-1">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>


        {/* Collecting and Using Personal Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Collecting and Using Your Personal Data</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Types of Data Collected</h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Personal Data</h4>
              <p className="text-gray-600 mb-4">
                While using Our Service, We may ask You to provide Us with certain personally identifiable information...
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Email address</li>
                <li>First name and last name</li>
                {/* Add all list items */}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Usage Data</h4>
              <p className="text-gray-600">
                Usage Data is collected automatically when using the Service...
              </p>
            </div>
          </div>

          {/* Tracking Technologies Section */}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Tracking Technologies and Cookies</h3>
            <p className="text-gray-600 mb-4">
              We use Cookies and similar tracking technologies to track the activity on Our Service...
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Types of Cookies We Use</h4>
              <div className="space-y-4">
                {[
                  { type: 'Necessary / Essential Cookies', details: 'Session Cookies...' },
                  // Add all cookie types
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-md shadow-sm">
                    <h5 className="font-medium text-gray-700 mb-1">{item.type}</h5>
                    <p className="text-gray-600 text-sm">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Continue with other sections following similar patterns */}

        {/* Contact Section */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, You can contact us:
          </p>
          <a 
            href="https://mantrigame.com/contact" 
            className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <span>By visiting this page on our website</span>
            <HiChevronRight className="ml-1 w-5 h-5" />
          </a>
        </section>

        <div className="mt-8 text-sm text-gray-500 text-center">
        Last updated: {new Date().toLocaleDateString("en-IN")}

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;