import React from 'react';
import { ClipboardList, Mail, CreditCard, KeyRound, CheckCircle, XCircle, Info } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: '1. Fill the Booking Form',
    desc: 'Enter your dates, number of guests and contact details. Takes less than 2 minutes.',
  },
  {
    icon: Mail,
    title: '2. Receive Confirmation',
    desc: 'We confirm availability and send you the final price within 24 hours via email.',
  },
  {
    icon: CreditCard,
    title: '3. Complete Payment',
    desc: 'Secure your booking with payment before check-in. Details provided in the confirmation email.',
  },
  {
    icon: KeyRound,
    title: '4. Self Check-in',
    desc: 'Access your apartment independently via key lockbox — no waiting, no schedules, total freedom.',
  },
];

const BookingInfo = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 px-2">
            How <span className="text-amber-600">Booking Works</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Simple, direct, no hidden fees — book straight from this page and get the best price.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm"
            >
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-amber-900" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Cancellation & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Cancellation */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cancellation Policy</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Short stays (1–28 nights) — Moderate</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Full refund</strong> if cancelled within 48h of booking AND at least 14 days before check-in</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span><strong>50% refund</strong> if cancelled at least 5 days before check-in</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span><strong>No refund</strong> if cancelled less than 5 days before check-in</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Long stays (&gt;28 nights) — Semi-flexible</p>
                <p className="text-sm text-gray-600">
                  Full refund if cancelled at least 30 days before check-in. Partial refund for later cancellations. Details provided with the booking confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-100 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Payment</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Bank Transfer (Bonifico)</p>
                  <p className="text-xs text-gray-500">IBAN provided at booking confirmation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Revolut</p>
                  <p className="text-xs text-gray-500">Fast transfer, details at confirmation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">PayPal</p>
                  <p className="text-xs text-gray-500">Details provided at booking confirmation</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 mt-2">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>No hidden fees.</strong> The price confirmed in the email is the total you pay. No deposit required for standard stays.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingInfo;
