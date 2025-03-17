import React, { useState } from "react";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { id: 1, name: "PhonePe" },
    { id: 2, name: "Paytm" },
    { id: 3, name: "Google Pay" },
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Payment</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Amount Payouts</h2>
          <p className="text-gray-700">100.00</p>
          <p className="text-gray-700">$ 3.30</p>
          <p className="text-gray-700">Use Mobile Share Code to pay</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Choose a payment method to pay:</h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`w-full p-3 rounded-lg border ${
                  selectedMethod === method.name
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handleMethodSelect(method.name)}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Manual Transfer</h2>
          <p className="text-gray-700 mb-2">
            1. Copy the below given till<br />
            [XXXXXXXXXXXXXXXX]
          </p>
          <p className="text-gray-700 mb-2">
            2. Get sure to use all sorts of keys
          </p>
          <p className="text-gray-700">
            3. Read to enter your UI for the GT10
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Barfile: Full file is required</h2>
          <p className="text-gray-700">
            To Clear your OT value and complete the transfer. Insert your window, fill with you line payment.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <p className="text-gray-700 mb-2">
            1. Please make sure you have installed the app
          </p>
          <p className="text-gray-700">
            2. Insert your IP on some full repository
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Notice</h2>
          <p className="text-gray-700 mb-2">
            1. (write), outside call if you have any payment issue;{" "}
            <a href="mailto:goodview.customer.service@gmail.com" className="text-blue-500">
              goodview.customer.service@gmail.com
            </a>
          </p>
          <p className="text-gray-700">
            2. Please select the payment method you need and make sure your phone has the corresponding wallet software installed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;