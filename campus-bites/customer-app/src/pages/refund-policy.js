import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <>
      <Head><title>Refund & Cancellation Policy | Lock N Load</title></Head>
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-colors">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <RefreshCw size={28} className="text-[#E94E24]" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Refund & Cancellation Policy</h1>
            </div>
          </div>

          {/* Non-Cancelable Banner */}
          <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <AlertTriangle size={28} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-bold text-lg">Orders are NON-CANCELABLE once placed</p>
              <p className="text-red-400/80 text-sm mt-1">Please review your cart carefully before confirming your order. Once OTP verification is complete and the order is placed, it cannot be cancelled under any circumstances.</p>
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-8 text-gray-300">
            <p className="text-gray-400 text-sm">Last updated: February 2026</p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Cancellation Policy</h2>
              <div className="space-y-4 leading-relaxed">
                <p>Lock N Load operates a <span className="text-[#E94E24] font-bold">strict no-cancellation policy</span> for all orders. Once an order is placed and confirmed through OTP verification, it enters immediate preparation and <strong className="text-white">cannot be cancelled</strong>.</p>
                <p>This policy exists because:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Food preparation begins immediately upon order confirmation.</li>
                  <li>Ingredients are allocated and may be perishable.</li>
                  <li>Kitchen resources are scheduled based on confirmed orders.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Refund Policy</h2>
              <div className="space-y-4 leading-relaxed">
                <p>Refunds are only considered in the following <span className="text-white font-semibold">exceptional circumstances</span>:</p>
                <div className="space-y-3">
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
                    <p className="font-semibold text-green-400 mb-1">✓ Payment deducted but order not confirmed</p>
                    <p className="text-sm text-gray-400">If your payment was processed but you did not receive an order confirmation, contact us immediately. We will investigate and process a full refund within 5-7 business days.</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
                    <p className="font-semibold text-green-400 mb-1">✓ Double payment charged</p>
                    <p className="text-sm text-gray-400">In case of a duplicate charge for the same order, the extra amount will be refunded within 5-7 business days after verification.</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
                    <p className="font-semibold text-green-400 mb-1">✓ Wrong or missing items</p>
                    <p className="text-sm text-gray-400">If you receive items significantly different from what was ordered, please report within 10 minutes of collection. We will offer a replacement or store credit at our discretion.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Non-Refundable Cases</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Change of mind after placing the order.</li>
                <li>Ordering incorrect items by mistake.</li>
                <li>Dissatisfaction with taste (subjective preference).</li>
                <li>Delays in preparation due to high demand or unforeseen circumstances.</li>
                <li>Failure to collect your order within a reasonable time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Refund Process</h2>
              <div className="space-y-3 leading-relaxed">
                <p>If you believe you qualify for a refund under the eligible cases above:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Contact us immediately at <span className="text-white font-semibold">+91 95978 55779</span>.</li>
                  <li>Provide your Order ID (found in your confirmation email).</li>
                  <li>Describe the issue clearly.</li>
                  <li>Our team will review and respond within 24 hours.</li>
                  <li>Approved refunds are processed to the original payment method within 5-7 business days.</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Online Payment Failures</h2>
              <p className="leading-relaxed">If an online payment (via Cashfree) fails and your amount is deducted, it will be automatically refunded to your source account by the payment gateway within 3-5 business days. If not received after 7 days, contact your bank or reach out to us.</p>
            </section>

            <section className="bg-gray-800/60 rounded-xl p-5 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-3">Contact Us</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Business:</span> <span className="text-white font-semibold">Lock N Load</span></p>
                <p><span className="text-gray-400">Location:</span> <span className="text-white">Open Air Theatre</span></p>
                <p><span className="text-gray-400">Phone:</span> <span className="text-white">+91 95978 55779</span></p>
                <p><span className="text-gray-400">Email:</span> <span className="text-white">linkeshrajd@gmail.com</span></p>
                <p className="text-gray-400 mt-2 text-xs">We aim to respond to all queries within 24 hours.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
