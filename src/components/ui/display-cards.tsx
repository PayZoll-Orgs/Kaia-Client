"use client";

import { cn } from "@/lib/utils";
import { Shield, Smartphone, CreditCard, Zap, CheckCircle } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Smartphone className="size-4 text-green-600" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-green-600",
  titleClassName = "text-green-600",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-green-200/50 bg-white/90 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[8rem] after:bg-gradient-to-l after:from-white after:to-transparent after:content-[''] hover:border-green-400/60 hover:bg-white [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-green-100 p-1">
          {icon}
        </span>
        <p className={cn("text-lg font-medium text-gray-800", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg text-gray-700">{description}</p>
      <p className="text-gray-500">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      icon: <Smartphone className="size-4 text-green-600" />,
      title: "LIFF Integration",
      description: "Native LINE App experience",
      date: "Seamless & secure",
      iconClassName: "text-green-600",
      titleClassName: "text-green-600",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-green-200 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Shield className="size-4 text-green-600" />,
      title: "Bank-Grade Security",
      description: "Protected by LINE's infrastructure",
      date: "Multi-layer encryption",
      iconClassName: "text-green-600",
      titleClassName: "text-green-600",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-green-200 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Zap className="size-4 text-green-600" />,
      title: "Instant Payments",
      description: "Real-time crypto transactions",
      date: "Lightning fast processing",
      iconClassName: "text-green-600",
      titleClassName: "text-green-600",
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
