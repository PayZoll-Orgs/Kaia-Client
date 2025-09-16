'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: "What is CryptoPay LINE and how does it work?",
            answer: 'CryptoPay LINE is a LIFF-powered application that integrates directly into your LINE app, allowing you to make cryptocurrency payments as easily as using LINE Pay. No separate wallet apps or complex setups required.',
        },
        {
            id: 'item-2',
            question: 'Which cryptocurrencies can I use for payments?',
            answer: 'We support major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT, USDC, and other popular stablecoins. Real-time exchange rates ensure you always know the exact cost of your purchase.',
        },
        {
            id: 'item-3',
            question: 'Is it safe to make crypto payments through LINE?',
            answer: 'Yes, absolutely. CryptoPay LINE uses bank-grade security powered by LINE\'s enterprise infrastructure. All transactions are protected by multi-layer encryption and blockchain security protocols.',
        },
        {
            id: 'item-4',
            question: 'Do I need a crypto wallet to use CryptoPay LINE?',
            answer: 'No traditional crypto wallet is required. CryptoPay LINE creates a secure, managed wallet integrated into your LINE experience. You can fund it easily and make payments without managing private keys or complex wallet software.',
        },
        {
            id: 'item-5',
            question: 'How do I get started with crypto payments?',
            answer: 'Simply open the CryptoPay LINE mini-app from your LINE application, complete the quick verification process, fund your account, and you\'re ready to make payments by scanning QR codes or clicking payment links.',
        },
        {
            id: 'item-6',
            question: 'What are the fees for using CryptoPay LINE?',
            answer: 'Our fees are significantly lower than traditional payment methods - typically 0.5-1% per transaction compared to 2.9-4% for credit cards. Network gas fees may apply depending on the cryptocurrency used.',
        },
        {
            id: 'item-7',
            question: 'Can merchants accept payments through CryptoPay LINE?',
            answer: 'Yes! Merchants can easily integrate CryptoPay LINE to accept crypto payments with instant settlement, low fees, and automatic conversion to their preferred currency. Integration is simple and requires minimal technical setup.',
        },
        {
            id: 'item-8',
            question: 'Is CryptoPay LINE available in my country?',
            answer: 'CryptoPay LINE is currently available in countries where LINE operates, with plans to expand globally. Check our supported regions list or contact support to see if your country is supported.',
        },
    ]

    return (
        <section className="py-16 md:py-24 bg-green-50/20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-gray-800">Frequently Asked Questions</h2>
                    <p className="text-gray-600 mt-4 text-balance">Get answers to common questions about CryptoPay LINE, security, supported currencies, and getting started.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="multiple"
                        className="bg-white/80 ring-green-200/50 w-full rounded-2xl border border-green-200 px-8 py-3 shadow-sm ring-4 backdrop-blur-sm">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-green-200/50">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline text-gray-800 hover:text-green-600 transition-colors">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base text-gray-600">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
