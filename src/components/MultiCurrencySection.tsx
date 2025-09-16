import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MultiCurrencySection = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Crypto Wallet Mockup */}
        <div className="flex justify-center relative">
          <div className="relative">
            {/* Main phone mockup */}
            <div className="w-48 h-96 bg-gray-200 rounded-3xl p-4 shadow-xl transform -rotate-12">
              <div className="w-full h-full bg-black rounded-2xl p-4">
                <div className="text-white text-center mb-4">
                  <div className="text-2xl font-bold">MATIC</div>
                  <div className="text-lg">17,908.59</div>
                </div>
                <div className="bg-orange-500 text-white text-center py-3 rounded-lg font-semibold">
                  Swap
                </div>
              </div>
            </div>
            
            {/* Floating wallet card */}
            <div className="absolute -right-16 top-8 bg-black rounded-2xl p-4 text-white w-48">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-bold">Bitcoin</div>
                      <div className="text-xs opacity-60">BTC</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-sm">+2.5%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-bold">Ethereum</div>
                      <div className="text-xs opacity-60">ETH</div>
                    </div>
                  </div>
                  <div className="text-red-400 text-sm">-1.2%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-bold">Dash</div>
                      <div className="text-xs opacity-60">DASH</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-sm">+0.8%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Multi-Currency Support
          </h3>
          <p className="text-gray-600">
            Store Bitcoin, Ethereum, and a wide range of altcoins
          </p>

          <h4 className="text-xl font-semibold text-gray-900">24/7 Support</h4>
          <p className="text-gray-600">
            Our team is always here to help you with any questions
          </p>

          <Button className="mt-4 px-6 py-3 rounded-2xl flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MultiCurrencySection;
