import { useEffect, useState } from 'react'
import { HiCurrencyRupee, HiUserCircle, HiCheckBadge } from 'react-icons/hi2'
import axios from 'axios'
import { HiGift } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton' // Install this package

const ReferralEarnings = () => {
  const [earnings, setEarnings] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

  const API_URL =
    import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/users/referral/earnings`)
        setTotalEarnings(response.data.totalEarnings)
        setEarnings(response.data.earnings)
      } catch (error) {
        console.error('Error fetching earnings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-IN', options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton height={100} className="mb-6 rounded-xl" />
        <Skeleton count={5} height={80} className="mb-4 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Total Earnings Card */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-2xl shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Total Referral Earnings</h2>
            <p className="text-4xl font-semibold flex items-center">
              <HiCurrencyRupee className="mr-2 w-8 h-8" />
              {formatCurrency(totalEarnings)}
            </p>
          </div>
          <HiGift className="w-16 h-16 opacity-75" />
        </div>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold p-6 border-b border-gray-100">
          Referral Transactions
        </h3>

        {earnings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No referrals yet. Share your referral code to start earning!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {earnings.map((earning) => (
              <div
                key={earning._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <HiUserCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {earning.referredUser?.name || 'Anonymous User'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(earning.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-green-600">
                      <HiCheckBadge className="w-5 h-5" />
                      <span className="font-semibold">
                        +{formatCurrency(earning.amount)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Commission Earned
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralEarnings