"use client";
import Image from 'next/image';
import GraffitiTitle from '@/components/GraffitiTitle';
import Link from 'next/link';

const QuestionSection = ({ number, question, children }: { number: string, question: string, children: React.ReactNode }) => {
  return (
    <div className="bg-black text-white p-8 rounded-2xl">
      <div className="mb-4 text-lg">{number}</div>
      <h3 className="text-2xl md:text-3xl mb-6">{question}</h3>
      {children}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/stellar-logo.svg"
                  alt="Stellar"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-900 hover:text-gray-600">
                About The Campaign
              </Link>
              <Link href="/build" className="text-gray-900 hover:text-gray-600">
                How Can We Build Better?
              </Link>
              <Link href="/newsletter" className="text-gray-900 hover:text-gray-600">
                Newsletter
              </Link>
              <Link 
                href="/contest-recap"
                className="inline-flex items-center px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Contest Recap
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-left">
            <h2 className="text-2xl font-medium text-green-600 mb-8">
              Seamless Payments
            </h2>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-black leading-tight mb-8">
              SEND MONEY<br />
              LIKE SENDING<br />
              <span className="flex gap-1.5">
              A <div className="bg-white mt-1 ml-0.5 h-[0.9em] p-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-black animate-fill-bar"></div>
                <div className="relative z-10 opacity-0 animate-fade-in-delayed">
                  <GraffitiTitle />
                </div>
              </div>
              </span>
             
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              Experience the future of digital payments. Split bills, send bulk payments, and manage transactions with ease.
            </p>
            <div className="flex gap-4">
              <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-black px-8 py-4 rounded-full hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Split Bills Easily</h3>
              <p className="text-gray-600">
                Split expenses with friends and family. Equal splits or custom amounts - you choose how to divide.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-2 0h-2m-4 0H8m-4 0h2m6 0v1m-6-1v1m12-2v1m-6-1v1m-6-1v1m12-2v1m-6-1v1m-6-1v1m12-2v1m-6-1v1m-6-1v1m12-2v1m-6-1v1m-6-1v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Bulk Payments</h3>
              <p className="text-gray-600">
                Send payments to multiple recipients in one go. Perfect for business payouts or group reimbursements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Transactions</h3>
              <p className="text-gray-600">
                Built on blockchain technology for secure, transparent, and instant transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container-width">
          <h2 className="text-3xl md:text-4xl mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Connect Wallet</h3>
              <p className="text-gray-600">
                Link your digital wallet to access all features securely
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Choose Recipients</h3>
              <p className="text-gray-600">
                Select friends or scan QR codes to add payment recipients
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Enter Amount</h3>
              <p className="text-gray-600">
                Specify payment amounts or split bills automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Confirm & Send</h3>
              <p className="text-gray-600">
                Review and confirm your transaction securely
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-black text-white">
        <div className="container-width">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Why Choose Our<br />
                Payment Platform?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                    <p className="text-gray-400">
                      Instant transactions with minimal fees. No more waiting for bank transfers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Group Friendly</h3>
                    <p className="text-gray-400">
                      Split bills and send bulk payments with just a few taps.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Blockchain Secure</h3>
                    <p className="text-gray-400">
                      Built on secure blockchain technology for transparent and safe transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 rounded-3xl overflow-hidden">
                <Image
                  src="/next.svg"
                  alt="Mobile app screenshot"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-gray-600">Secure Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-green-50">
        <div className="container-width text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying seamless digital payments.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors">
              Create Account
            </button>
            <button className="border-2 border-black px-8 py-4 rounded-full hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay up to date</h2>
              <h3 className="text-6xl md:text-7xl font-bold mb-8">
                NEVER MISS<br />
                WHAT'S NEXT
              </h3>
              <p className="text-xl text-gray-700">
                Sign up for the latest news, events, and more from the Stellar network.
              </p>
            </div>
            <div>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300" />
                    <span>
                      <div className="font-medium">Stellar newsletter</div>
                      <div className="text-gray-600">Receive monthly updates about Stellar news, partnerships, and resources.</div>
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300" />
                    <span>
                      <div className="font-medium">Developer newsletter</div>
                      <div className="text-gray-600">Get technical updates and resources for building on Stellar.</div>
                    </span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <button className="btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding bg-black text-white">
        <div className="container-width">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h4 className="font-bold mb-4">ABOUT US</h4>
              <ul className="space-y-2">
                <li><Link href="/team">Team</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/roadmap">Roadmap</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">THE STELLAR NETWORK</h4>
              <ul className="space-y-2">
                <li><Link href="/ecosystem">Ecosystem Projects</Link></li>
                <li><Link href="/learn">Learn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">DEVELOPERS</h4>
              <ul className="space-y-2">
                <li><Link href="/docs">Stellar Network Docs</Link></li>
                <li><Link href="/api">API Reference</Link></li>
                <li><Link href="/bug-bounty">Bug Bounty</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">CONNECT</h4>
              <ul className="space-y-2">
                <li><Link href="/community">Community</Link></li>
                <li><Link href="/code-of-conduct">Code of Conduct</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>
              <div>© 2025 Stellar Development Foundation</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
