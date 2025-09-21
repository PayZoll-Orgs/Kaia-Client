import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react";

interface TiltedScrollItem {
  id: string;
  text: string;
}

interface TiltedScrollProps {
  items?: TiltedScrollItem[];
  className?: string;
}

const defaultItems: TiltedScrollItem[] = [
  { id: "1", text: "Non‑custodial wallet: You control your keys." },
  { id: "2", text: "QR payments: Scan to send/receive." },
  { id: "3", text: "LINE integration: Pay your contacts." },
  { id: "4", text: "Low fees: Fast, affordable transfers." },
  { id: "5", text: "Secure transactions: Bank-level encryption." },
  { id: "6", text: "Instant settlements: Real-time processing." },
  { id: "7", text: "Multi-currency support: Global payments." },
  { id: "8", text: "24/7 availability: Always accessible." },
]

export function TiltedScroll({ 
  items = defaultItems,
  className 
}: TiltedScrollProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_5rem),linear-gradient(to_left,transparent,black_5rem),linear-gradient(to_bottom,transparent,black_5rem),linear-gradient(to_top,transparent,black_5rem)]">
        <div className="grid h-[250px] w-[300px] gap-5 animate-skew-scroll grid-cols-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 cursor-pointer rounded-md border border-gray-200 bg-gradient-to-b from-white/80 to-gray-50/80 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-xl"
            >
              <CheckCircle className="h-6 w-6 mr-2 stroke-gray-400 transition-colors group-hover:stroke-teal-600" />
              <p className="text-gray-600 transition-colors group-hover:text-gray-900">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
