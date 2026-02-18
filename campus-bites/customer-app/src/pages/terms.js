import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <>
      <Head><title>Terms & Conditions | Lock N Load</title></Head>
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-colors">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <Shield size={28} className="text-[#E94E24]" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms & Conditions</h1>
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-8 text-gray-300">
            <p className="text-gray-400 text-sm">Last updated: February 2026</p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">By accessing or using the Lock N Load food ordering platform ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. About Lock N Load</h2>
              <p className="leading-relaxed">Lock N Load is a food ordering service operated at the Open Air Theatre. We provide a digital platform for customers to browse our menu, place orders, and make payments online or cash on delivery.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>You must provide a valid email address to register and place orders.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>Each order placement requires OTP verification sent to your registered email.</li>
                <li>We reserve the right to suspend accounts that violate these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Orders & Payments</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>All prices displayed are inclusive of applicable taxes.</li>
                <li>We accept Cash on Delivery (COD) and online payments via Cashfree (UPI, Cards, Net Banking).</li>
                <li>Orders are confirmed only after successful OTP verification.</li>
                <li>Estimated preparation time is 15–20 minutes. Actual times may vary.</li>
                <li>Lock N Load reserves the right to refuse or cancel any order at its discretion.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Non-Cancelable Orders</h2>
              <p className="leading-relaxed">Once an order is confirmed and placed, <span className="text-[#E94E24] font-bold">it cannot be cancelled</span>. Please review your order carefully before confirming. For any concerns, contact us at <span className="text-white font-semibold">+91 95978 55779</span>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Food Quality & Allergens</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Our kitchen handles common allergens including gluten, dairy, eggs, and nuts.</li>
                <li>Menu items marked veg/non-veg are prepared in a shared kitchen environment.</li>
                <li>Customers with severe allergies are advised to contact us before ordering.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Intellectual Property</h2>
              <p className="leading-relaxed">All content on this platform — including the Lock N Load name, logo, images, and menu content — is the property of Lock N Load and may not be reproduced without written permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
              <p className="leading-relaxed">Lock N Load shall not be liable for any indirect, incidental, or consequential damages arising from the use of our Service. Our maximum liability is limited to the value of the order placed.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Privacy</h2>
              <p className="leading-relaxed">We collect your name, email, and phone number solely for the purpose of order processing and communication. We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Changes to Terms</h2>
              <p className="leading-relaxed">We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes your acceptance of the revised Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
              <p className="leading-relaxed">For any questions regarding these Terms, please contact us:</p>
              <div className="mt-3 bg-gray-800/60 rounded-xl p-4 space-y-1">
                <p><span className="text-gray-400">Business:</span> <span className="text-white font-semibold">Lock N Load</span></p>
                <p><span className="text-gray-400">Location:</span> <span className="text-white">Open Air Theatre</span></p>
                <p><span className="text-gray-400">Phone:</span> <span className="text-white">+91 95978 55779</span></p>
                <p><span className="text-gray-400">Email:</span> <span className="text-white">linkeshrajd@gmail.com</span></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
