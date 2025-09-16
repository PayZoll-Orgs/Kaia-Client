"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundPaths } from './background-paths'

export default function Globe3D() {
  return (
    <section
      className="relative w-full overflow-hidden bg-white pb-10 pt-32 font-light text-gray-800 antialiased md:pb-16 md:pt-20"
      style={{
        background: "linear-gradient(135deg, #f8fffe 0%, #ffffff 100%)",
      }}
    >
      <div
        className="absolute right-0 top-0 h-1/2 w-1/2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.08) 0%, rgba(255, 255, 255, 0) 60%)",
        }}
      />
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.08) 0%, rgba(255, 255, 255, 0) 60%)",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="mb-6 inline-block rounded-full border border-green-500/30 px-3 py-1 text-xs text-green-600 bg-green-50">
            POWERED BY LINE & LIFF
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light md:text-5xl lg:text-7xl text-gray-800">
            Pay with <span className="text-green-600">Crypto</span> as Easy as LINE Pay
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
            The simplest way to make crypto payments. No wallets, no complexity - just open LINE and pay instantly with your favorite cryptocurrencies.
          </p>

          <div className="mb-10 sm:mb-0 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signin"
              className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 sm:w-auto"
            >
              Open in LINE
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                if (element) {
                  element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              className="flex w-full items-center justify-center gap-2 text-gray-600 transition-colors hover:text-gray-800 sm:w-auto"
            >
              <span>See how it works</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
          </div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="w-full flex h-40 md:h-64 relative overflow-hidden">
            <BackgroundPaths />
          </div>
          <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.15)] border border-green-200">
            <img
              src="/cryptopay-dashboard.jpeg"
              alt="CryptoPay LINE Dashboard"
              className="h-auto w-full rounded-lg border border-green-100"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
