"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  Play,
  Download,
  Menu,
  X,
  Send,
  ArrowDownLeft,
  Globe,
  Users,
  Shield,
  QrCode,
  ArrowRightLeft,
  FileText,
  CheckCircle,
  Scan,
  Plus,

} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TiltedScroll } from "@/components/ui/tilted-scroll";
import { cn } from "@/lib/utils";

interface StepEntry {
  title: string;
  description: string;
  phoneContent: React.ReactNode;
}

export default function ZenCryptoLanding() {


  interface AnimatedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string;
    textClassName?: string;
    underlineClassName?: string;
    underlinePath?: string;
    underlineHoverPath?: string;
    underlineDuration?: number;
  }

  const AnimatedText = React.forwardRef<HTMLSpanElement, AnimatedTextProps>(
    (
      {
        text,
        textClassName,
        underlineClassName,
        underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
        underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
        underlineDuration = 1.5,
        ...props
      },
      ref
    ) => {
      const pathVariants: Variants = {
        hidden: {
          pathLength: 0,
          opacity: 0,
        },
        visible: {
          pathLength: 1,
          opacity: 1,
          transition: {
            duration: underlineDuration,
            ease: "easeInOut",
          },
        },
      };

      return (
        <span
          ref={ref}
          className={cn("inline-flex relative items-baseline align-baseline", props.className)}
        >
          <motion.span
            className={cn("text-inherit font-inherit leading-tight", textClassName)}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {text}
          </motion.span>

          <motion.svg
            width="100%"
            height="20"
            viewBox="0 0 300 20"
            className={cn("absolute left-0", underlineClassName)}
            style={{ bottom: "-0.2em" }}
          >
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                d: underlineHoverPath,
                transition: { duration: 0.8 },
              }}
            />
          </motion.svg>
        </span>
      );
    }
  );

  AnimatedText.displayName = "AnimatedText";


  // Navigation Component
  // Replace your existing Navigation component with this updated version
  const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
      <header className="fixed w-full bg-transparent bg-opacity-95 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo Section - Left */}
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div> */}
            <span className="text-black font-bold text-3xl">PayZoll</span>
          </div>

          {/* Navigation Menu - Center */}
       

          {/* Right Section - Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.payzoll.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-600 hover:border-gray-500 transition-all duration-300"
            >
              Visit Site
            </a>
            <>
              <button
                onClick={() => {
                  const modalDiv = document.createElement('div');
                  modalDiv.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4';
                  modalDiv.innerHTML = `
                    <div class="relative">
                      <!-- Mobile Frame -->
                      <div class="relative w-[400px] h-[780px] bg-black rounded-[3rem] p-4 shadow-2xl">
                        <!-- Phone details -->
                        <div class="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full z-10"></div>
                        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10 flex justify-center items-end pb-1">
                          <div class="w-20 h-4 bg-black rounded-md flex items-center justify-center">
                            <div class="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                            <div class="w-8 h-1 bg-gray-600 rounded-full"></div>
                          </div>
                        </div>
                        
                        <!-- Volume buttons -->
                        <div class="absolute left-[-14px] top-32 w-2 h-12 bg-gray-800 rounded-l-lg"></div>
                        <div class="absolute left-[-14px] top-48 w-2 h-12 bg-gray-800 rounded-l-lg"></div>
                        
                        <!-- Power button -->
                        <div class="absolute right-[-14px] top-40 w-2 h-16 bg-gray-800 rounded-r-lg"></div>
                        
                        <!-- Screen -->
                        <div class="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                          <!-- Close button -->
                          <button id="close-modal-btn" class="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-gray-800/70 hover:bg-gray-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                          
                          <!-- Loading spinner -->
                          <div id="loading-spinner" class="absolute inset-0 flex items-center justify-center bg-white">
                            <div class="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                          </div>
                          
                          <!-- Iframe to load the website -->
                          <iframe 
                            src="https://payzoll-pay.onrender.com/" 
                            class="w-full h-full border-0"
                            title="PayZoll App"
                            onload="document.getElementById('loading-spinner').style.display='none'"
                          ></iframe>
                        </div>
                        
                        <!-- Home indicator -->
                        <div class="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                  `;
                  
                  document.body.appendChild(modalDiv);
                  
                  // Add event listener to close button
                  const closeBtn = modalDiv.querySelector('#close-modal-btn');
                  if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                      document.body.removeChild(modalDiv);
                    });
                  }
                  
                  // Close on backdrop click
                  modalDiv.addEventListener('click', (e) => {
                    if (e.target === modalDiv) {
                      document.body.removeChild(modalDiv);
                    }
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all duration-300 font-medium"
              >
                Launch App
              </button>
            </>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 bg-opacity-98 backdrop-blur-md border-t border-gray-800">
            <div className="px-6 py-4 space-y-3">
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <a
                  href="#contact"
                  className="block text-gray-300 hover:text-green-400 py-2 transition-colors duration-300"
                >
                  Contact us
                </a>
                <button className="w-full text-left text-gray-300 hover:text-white px-4 py-2 rounded-md border border-gray-600 transition-all duration-300">
                  Sign In
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-300 font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    );
  };


  // Phone Mockup Component with Dynamic Content
  const StepPhone = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-64 h-[520px] bg-gradient-to-b from-green-800 to-green-900 rounded-[2.5rem] p-2 shadow-2xl">
      <div className="w-full h-full bg-gradient-to-b from-green-700 to-green-800 rounded-[2rem] overflow-hidden">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white text-sm">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            </div>
            <span className="ml-2">100</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  // Stepper Timeline Component
  const StepTimeline = ({ data, title, subtitle }: { data: StepEntry[], title: string, subtitle: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    }, [ref]);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
      <div className="w-full bg-gray-50 font-sans" ref={containerRef}>
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row justify-center items-center pt-10 md:pt-20 md:gap-16"
            >
              {/* Step Content */}
              <div className="flex flex-col md:flex-row items-center lg:w-1/2 max-w-lg">
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start">
                  <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                    <div className="text-2xl font-bold text-white">{String(index + 1).padStart(2, '0')}</div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Display */}
              <motion.div
                className="lg:w-1/2 flex justify-center mt-8 lg:mt-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <StepPhone>
                  {item.phoneContent}
                </StepPhone>
              </motion.div>
            </div>
          ))}

          {/* Animated Line */}
          <div
            style={{ height: height + "px" }}
            className="absolute left-8 md:left-20 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-green-500 via-green-400 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
      </div>
    );
  };

  // How It Works Steps
  const howItWorksSteps: StepEntry[] = [
    {
      title: "Sign in with LINE",
      description: "Connect your LINE account securely to access PayZoll's payment features.",
      phoneContent: (
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="bg-white rounded-3xl p-8 w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">LINE</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome to PayZoll</h3>
            <p className="text-gray-600 text-sm mb-6">Sign in with your LINE account to get started</p>
            <button className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
              Continue with LINE
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Add or scan a friend",
      description: "Find contacts from your LINE friends or scan QR codes to add new payment recipients.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold">Add Friend</h3>
            <QrCode className="w-6 h-6 text-white/70" />
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Scan className="w-5 h-5 text-green-600" />
              <span className="text-gray-900 font-medium">Scan QR Code</span>
            </div>
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-4xl">📷</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-gray-900 font-medium">LINE Friends</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                <span className="text-gray-900 text-sm">Sarah Kim</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                <span className="text-gray-900 text-sm">Mike Chen</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Enter amount or split",
      description: "Choose payment amount or split bills equally among friends with one tap.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">Send Payment</h3>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
              <span className="text-white text-sm">to Sarah Kim</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 mb-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-light text-gray-900 mb-2">$ 45.00</div>
              <p className="text-gray-500 text-sm">Dinner bill split</p>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-medium">
                Split Equally (3 people)
              </button>
              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium">
                Send $45.00
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
              <div>You: $15.00</div>
              <div>Sarah: $15.00</div>
              <div>Mike: $15.00</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Confirm—done",
      description: "Verify transaction details and send instantly with bank-level security.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Payment Sent!</h3>
            <p className="text-white/70 text-sm">Transaction completed successfully</p>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="text-center border-b border-gray-100 pb-4">
              <div className="text-2xl font-light text-gray-900 mb-1">$15.00</div>
              <p className="text-gray-500 text-sm">Sent to Sarah Kim</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="text-gray-900">TX-2025-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee</span>
                <span className="text-gray-900">$0.02</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>

            <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-medium mt-4">
              View Receipt
            </button>
          </div>
        </div>
      )
    }
  ];

  // Bulk Payments Steps
  const bulkPaymentSteps: StepEntry[] = [
    {
      title: "Select bulk payment",
      description: "Choose the bulk payment option to send crypto to multiple recipients at once.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">Payment Options</h3>
            <p className="text-white/70 text-sm">Choose how you want to send</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Send className="w-6 h-6 text-gray-400" />
                <span className="text-gray-900 font-medium">Single Payment</span>
              </div>
              <p className="text-gray-500 text-sm">Send to one person</p>
            </div>

            <div className="bg-green-500 rounded-2xl p-4 border-2 border-green-400">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-white" />
                <span className="text-white font-medium">Bulk Payment</span>
              </div>
              <p className="text-white/90 text-sm">Send to multiple people at once</p>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <ArrowRightLeft className="w-6 h-6 text-gray-400" />
                <span className="text-gray-900 font-medium">Split Bill</span>
              </div>
              <p className="text-gray-500 text-sm">Divide costs among friends</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Add recipients",
      description: "Add multiple recipients from your contacts or by scanning QR codes.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold">Bulk Payment</h3>
            <button className="bg-green-500 rounded-full p-1">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4">
            <h4 className="text-gray-900 font-medium mb-4">Recipients (3)</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-900 text-sm">Sarah Kim</span>
                </div>
                <input
                  className="w-20 text-right text-sm bg-white border rounded px-2 py-1"
                  placeholder="$0.00"
                  defaultValue="$50.00"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-900 text-sm">Mike Chen</span>
                </div>
                <input
                  className="w-20 text-right text-sm bg-white border rounded px-2 py-1"
                  placeholder="$0.00"
                  defaultValue="$25.00"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-900 text-sm">Alex Lee</span>
                </div>
                <input
                  className="w-20 text-right text-sm bg-white border rounded px-2 py-1"
                  placeholder="$0.00"
                  defaultValue="$75.00"
                />
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between">
              <span className="font-medium text-gray-900">Total:</span>
              <span className="font-medium text-gray-900">$150.00</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Review and confirm",
      description: "Review all recipients and amounts before sending the bulk payment.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">Review Payment</h3>
            <p className="text-white/70 text-sm">Confirm details before sending</p>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="text-center border-b border-gray-100 pb-4">
              <div className="text-3xl font-light text-gray-900 mb-2">$150.00</div>
              <p className="text-gray-500 text-sm">Total to 3 recipients</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-900">Sarah Kim</span>
                </div>
                <span className="text-gray-900 font-medium">$50.00</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-900">Mike Chen</span>
                </div>
                <span className="text-gray-900 font-medium">$25.00</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-900">Alex Lee</span>
                </div>
                <span className="text-gray-900 font-medium">$75.00</span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-500">Network Fee</span>
                <span className="text-gray-900">$0.05</span>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium mt-4">
              Send Bulk Payment
            </button>
          </div>
        </div>
      )
    },
    {
      title: "All payments sent",
      description: "Track individual transaction statuses and view detailed receipts.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Bulk Payment Complete!</h3>
            <p className="text-white/70 text-sm">All transactions processed successfully</p>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-4">
            <h4 className="text-gray-900 font-medium mb-4">Transaction Status</h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-900">Sarah Kim</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">$50.00</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-900">Mike Chen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">$25.00</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-900">Alex Lee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">$75.00</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-medium mt-4">
              View All Receipts
            </button>
          </div>
        </div>
      )
    }
  ];

  // Split Bills Steps
  const splitBillSteps: StepEntry[] = [
    {
      title: "Create bill split",
      description: "Start by creating a new bill split for your group expense.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">New Bill Split</h3>
            <p className="text-white/70 text-sm">Split expenses with friends</p>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🍽️</div>
              <h4 className="text-lg font-semibold text-gray-900">Dinner Bill</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Total Amount</label>
                <input
                  className="w-full text-center text-2xl font-light border-b-2 border-green-200 focus:border-green-500 outline-none py-2"
                  placeholder="$0.00"
                  defaultValue="$120.00"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Description (Optional)</label>
                <input
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-green-500 outline-none"
                  placeholder="e.g., Team dinner at Italian restaurant"
                  defaultValue="Team dinner at Marco's"
                />
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium">
              Add People
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Add participants",
      description: "Invite friends and choose how to split the bill among the group.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold">Add Participants</h3>
            <span className="text-white/70 text-sm">$120.00 total</span>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-gray-900 font-medium">Participants (4)</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">You</span>
                  </div>
                  <span className="text-gray-900 text-sm font-medium">You</span>
                </div>
                <span className="text-green-600 font-medium">$30.00</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-900 text-sm">Sarah Kim</span>
                </div>
                <span className="text-gray-600">$30.00</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-900 text-sm">Mike Chen</span>
                </div>
                <span className="text-gray-600">$30.00</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-900 text-sm">Alex Lee</span>
                </div>
                <span className="text-gray-600">$30.00</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700 text-sm">Split equally among 4 people</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Send payment requests",
      description: "Send payment requests to all participants with their share amounts.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">Send Requests</h3>
            <p className="text-white/70 text-sm">Request payment from participants</p>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="text-center border-b border-gray-100 pb-4">
              <div className="text-2xl font-light text-gray-900 mb-1">Team dinner at Marco&apos;s</div>
              <p className="text-gray-500 text-sm">$120.00 ÷ 4 people = $30.00 each</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-green-700 font-medium">You paid</span>
                  </div>
                  <span className="text-green-700 font-medium">$120.00</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-sm">Payment requests:</p>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-900">Sarah Kim</span>
                  </div>
                  <span className="text-gray-900">$30.00</span>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-900">Mike Chen</span>
                  </div>
                  <span className="text-gray-900">$30.00</span>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-900">Alex Lee</span>
                  </div>
                  <span className="text-gray-900">$30.00</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium">
              Send All Requests
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Track payments",
      description: "Monitor who has paid and send reminders to those who haven't.",
      phoneContent: (
        <div className="flex-1 px-6 py-4">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">Bill Status</h3>
            <p className="text-white/70 text-sm">2 of 3 people have paid</p>
          </div>

          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="text-center border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900 mb-1">Team dinner at Marco&apos;s</div>
              <div className="flex justify-center items-center gap-2">
                <span className="text-2xl font-light text-green-600">$60.00</span>
                <span className="text-gray-500">/ $90.00 collected</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                  <div>
                    <span className="text-gray-900 font-medium block">Sarah Kim</span>
                    <span className="text-green-600 text-sm">Paid • 5 min ago</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">$30.00</div>
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
                  <div>
                    <span className="text-gray-900 font-medium block">Mike Chen</span>
                    <span className="text-green-600 text-sm">Paid • 12 min ago</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">$30.00</div>
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                  <div>
                    <span className="text-gray-900 font-medium block">Alex Lee</span>
                    <span className="text-orange-600 text-sm">Pending payment</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-orange-600 font-medium">$30.00</div>
                  <button className="text-orange-600 text-sm underline">Remind</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Hero Phone Mockup with Green Theme
  const WalletScreen = () => (
    <div className="relative w-64 h-[520px] bg-gradient-to-b from-green-800 to-green-900 rounded-[2.5rem] p-2 shadow-2xl">
      <div className="w-full h-full bg-gradient-to-b from-green-700 to-green-800 rounded-[2rem] overflow-hidden">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white text-sm">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            </div>
            <span className="ml-2">100</span>
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm">LINE Friend</span>
            </div>
          </div>
          <QrCode className="w-6 h-6 text-white/70" />
        </div>

        {/* Balance Section */}
        <div className="px-6 py-8 text-center">
          <p className="text-white/70 text-sm mb-2">Total balance</p>
          <h1 className="text-white text-4xl font-light mb-6">
            $ 12,249.<span className="text-white/50">00</span>
          </h1>

          <div className="flex gap-4 mb-8">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm">
              <Send className="w-4 h-4" />
              Send
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm">
              <ArrowRightLeft className="w-4 h-4" />
              Split
            </button>
          </div>

          <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 rounded-full text-white/70 text-sm">
            <QrCode className="w-4 h-4" />
            Scan to pay
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-t-3xl px-6 pt-6 pb-8 flex-1">
          <div className="flex gap-2 mb-4">
            <span className="text-sm text-gray-500">Recent payments</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Split dinner bill</p>
                  <p className="text-gray-500 text-sm">3 friends • 2 min ago</p>
                </div>
              </div>
              <span className="text-gray-900 font-medium">-$45.00</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Received from Sarah</p>
                  <p className="text-gray-500 text-sm">LINE contact • 1 hour ago</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">+$125.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Crypto Cards Section with Green Theme
  const CryptoCardsSection = () => {
    const [, setHoveredCard] = useState<string | null>(null);

    return (
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
            {/* Cards Display */}
            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start w-full lg:w-1/2"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              {/* KAIA Card */}
              <motion.div
                className="relative w-72 h-44 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-300"
                style={{ backgroundColor: '#e91e63' }}
                onMouseEnter={() => setHoveredCard('kaia')}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                initial={{ opacity: 0, rotateX: 45, rotateY: -20, scale: 0.8 }}
                whileInView={{
                  opacity: 1,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-2xl">
                  <svg className="absolute -top-4 -right-4 w-24 h-24 text-black/20" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M0,0 Q50,50 100,0 L100,50 Q50,0 0,50 Z" />
                  </svg>
                </div>

                <div className="absolute top-6 left-6 flex items-center gap-3 text-white font-bold text-lg tracking-wide">
                  <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="text-white font-bold text-sm">K</div>
                  </div>
                  KAIA
                </div>

                <div className="absolute bottom-16 left-6">
                  <div className="w-12 h-8 bg-gradient-to-br from-gray-200 to-gray-400 rounded border border-gray-300 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-px">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-1">
                  <div className="w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
                  <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-80 -ml-3"></div>
                </div>
              </motion.div>

              {/* USDT Card */}
              <motion.div
                className="relative w-72 h-44 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-300"
                style={{ backgroundColor: '#26a17b' }}
                onMouseEnter={() => setHoveredCard('usdt')}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05, rotateY: -5 }}
                initial={{ opacity: 0, rotateX: 45, rotateY: 20, scale: 0.8 }}
                whileInView={{
                  opacity: 1,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-2xl">
                  <svg className="absolute -top-4 -right-4 w-24 h-24 text-black/20" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M0,0 Q50,50 100,0 L100,50 Q50,0 0,50 Z" />
                  </svg>
                </div>

                <div className="absolute top-6 left-6 flex items-center gap-3 text-white font-bold text-lg tracking-wide">
                  <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="text-white font-bold text-sm">₮</div>
                  </div>
                  USDT
                </div>

                <div className="absolute bottom-16 left-6">
                  <div className="w-12 h-8 bg-gradient-to-br from-gray-200 to-gray-400 rounded border border-gray-300 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-px">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-1">
                  <div className="w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
                  <div className="w-8 h-8 bg-orange-400 rounded-full opacity-80 -ml-3"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Text content */}
            <motion.div
              className="max-w-xl text-center lg:text-left w-full lg:w-1/2"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.h2
                className="text-2xl lg:text-4xl font-bold mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                One tap to pay friends, split costs, and batch send in{" "}
                <span className="relative">
                  <span className="text-green-400">KAIA, USDT, and other top tokens.</span>
                  <motion.div
                    className="absolute bottom-2 left-0 right-0 h-1 bg-green-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Bitcoin, Ethereum, stablecoins, and more—one wallet, zero hassle.
              </motion.p>

              <motion.button
                className="px-8 py-4 bg-green-600 rounded-xl text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: 1.4,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section - Updated with Green Theme */}
      <section className="bg-white pt-40 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-3 items-center max-w-7xl mx-auto">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Pay friends, earn rewards, invest and borrow with crypto. <AnimatedText
                  text="Instantly."
                  underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                  underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
                  underlineDuration={1.5}
                />
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Send, split, earn and borrow, scan—secured by Kaia, integrated with LINE.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors shadow-lg">
                  Get Started
                </button>

                <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-medium border-2 border-green-200 hover:border-green-300 transition-colors" onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Play className="w-6 h-6" />
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <WalletScreen />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with TiltedScroll */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Everything you need for crypto payments
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful features designed to make crypto as easy as cash.
            </motion.p>
          </div>

          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TiltedScroll
              items={[
                { id: "1", text: "Non‑custodial wallet: You control your keys." },
                { id: "2", text: "QR payments: Scan to send/receive." },
                { id: "3", text: "LINE integration: Pay your contacts." },
                { id: "4", text: "Low fees: Fast, affordable transfers." },
                { id: "5", text: "Secure transactions: Bank-level encryption." },
                { id: "6", text: "Instant settlements: Real-time processing." },
                { id: "7", text: "Multi-currency support: Global payments." },
                { id: "8", text: "24/7 availability: Always accessible." },
              ]}
              className="mt-8"
            />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works">
        <StepTimeline
          data={howItWorksSteps}
          title="How it works"
          subtitle="Four simple steps to start paying friends with crypto through LINE integration."
        />
      </section>

      {/* Bulk Payments Section */}
      <section id="bulk-payments">
        <StepTimeline
          data={bulkPaymentSteps}
          title="Bulk Payments Made Easy"
          subtitle="Send crypto to multiple recipients at once with our streamlined bulk payment feature."
        />
      </section>

      {/* Split Bills Section */}
      <section id="split-bills">
        <StepTimeline
          data={splitBillSteps}
          title="Split Bills Effortlessly"
          subtitle="Divide group expenses and request payments from friends with automatic calculations."
        />
      </section>

      {/* Multi-currency Section */}
      <CryptoCardsSection />

      {/* Security Section */}
      <section id="security" className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Security, by default.
            </h2>
            <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-600">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Encrypted
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Session protection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-green-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Trusted by crypto users.
            </h2>
            <blockquote className="text-2xl text-gray-600 mb-4">
              &ldquo;Took seconds to split bills.&rdquo;
            </blockquote>
            <p className="text-gray-500">— Verified user</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "Is my crypto safe?",
                  answer: "Yes—non‑custodial + encryption."
                },
                {
                  question: "Which coins are supported?",
                  answer: "BTC, ETH, stablecoins, and more."
                },
                {
                  question: "How fast are transfers?",
                  answer: "Seconds to minutes."
                },
                {
                  question: "Can I restore my wallet?",
                  answer: "Yes—12/24‑word recovery."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Join the future of crypto payments.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-colors shadow-lg">
                <Download className="w-6 h-6" />
                Get the App
              </button>
              <button className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-medium hover:bg-white/10 transition-colors">
                <FileText className="w-6 h-6" />
                View Docs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">PayZoll</span>
              </div>
              <p className="text-gray-400 mb-6">
                The future of crypto payments, secured by Kaia and integrated with LINE.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Docs</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PayZoll. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}