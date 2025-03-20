import React from 'react';
import { useNavigate } from 'react-router-dom';

const RiskDisclosure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <button 
        onClick={() => {
          if (window.history.state?.idx > 0) {
            navigate(-1);
          } else {
            navigate('/settings');
          }
        }}
        className="mb-6 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
      >
        &larr; Back to Setting
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Risk Disclosure Agreement</h1>

        {/* Chapter 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chapter 1: Booking/Collection Description</h2>
          <p className="text-gray-600 mb-4">
            Prepayment Booking/Recycling Customer should read and understand the business content carefully before making prepayment bookings:
          </p>

          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li>
              Customers must complete real name authentication with accurate information including:
              <ul className="list-disc pl-6 mt-2">
                <li>Full name</li>
                <li>ID number</li>
                <li>Bank account details</li>
                <li>Delivery address</li>
              </ul>
            </li>

            <li>
              Gold/silver product ordering guidelines:
              <ul className="list-disc pl-6 mt-2">
                <li>Orders cancellable until 01:30 AM every Saturday</li>
                <li>Final payment must be completed for delivery arrangement</li>
                <li>Failure to pay by deadline results in automatic cancellation</li>
              </ul>
            </li>

            <li>
              Recycling requirements:
              <ul className="list-disc pl-6 mt-2">
                <li>Requires credit margin confirmation</li>
                <li>Cancellation permitted before 01:30 AM Saturday</li>
                <li>Logistics/testing costs apply for failed deliveries</li>
              </ul>
            </li>

            <li>Inventory hours: 01:30-05:30 daily (no transactions during this period)</li>
          </ol>
        </section>

        {/* Chapter 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chapter 2: Business Model Disclosure</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Customers acknowledge understanding of:
              <ul className="list-disc pl-6 mt-2">
                <li>Real-time market fluctuations</li>
                <li>Commodity value risks</li>
                <li>Process system modifications</li>
              </ul>
            </p>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Key Risk Factors:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Price discrepancies between markets</li>
                <li>Irreversible online transactions</li>
                <li>No profit guarantees from service providers</li>
                <li>Technical/network failure risks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Warm Tips */}
        <section className="mb-8 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Important Notices</h2>
          <div className="space-y-4 text-gray-600">
            <p>➤ Minimum age requirement: <strong>18 years</strong></p>
            
            <p>➤ Eligible participants must:</p>
            <ol className="list-decimal pl-6">
              <li>Be legally recognized entities</li>
              <li>Understand all associated risks</li>
              <li>Possess market knowledge of precious metals</li>
            </ol>

            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-2">Policy Risks Include:</h3>
              <ul className="list-disc pl-6">
                <li>Regulatory changes</li>
                <li>Economic fluctuations</li>
                <li>Force majeure events</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Risk Agreement */}
        <section className="mb-8 border-t pt-6">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Risk Acknowledgment</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              By proceeding, I confirm that:
              <ul className="list-disc pl-6 mt-2">
                <li>I have read all documentation thoroughly</li>
                <li>I accept full financial responsibility</li>
                <li>I waive legal claims against Mantri Malls</li>
              </ul>
            </p>

            <div className="bg-red-100 p-4 rounded-lg">
              <p className="font-semibold">Note:</p>
              <p>
                I understand this agreement supersedes statutory protections under Indian law 
                and accept all consequences of participation.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cancellation Policy</h2>
          <div className="space-y-4 text-gray-600">
            <p>We reserve rights to cancel orders due to:</p>
            <ul className="list-disc pl-6">
              <li>Inventory limitations</li>
              <li>Pricing errors</li>
              <li>Product information discrepancies</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Refund Guidelines:</h3>
              <ul className="list-disc pl-6">
                <li>Pre-shipment cancellations: 5 working days processing</li>
                <li>Smart Buy/Custom orders: Non-refundable</li>
                <li>Failed transactions: 72-hour auto-refund</li>
              </ul>
            </div>
          </div>
        </section>
        <div className="mt-8 text-sm text-gray-500 text-center">
          Effective: {new Date().toLocaleDateString("en-IN")}
        </div>
      </div>
    </div>
  );
};

export default RiskDisclosure;