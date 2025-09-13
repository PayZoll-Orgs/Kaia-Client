"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Each file contains strokes for one letter.
// The paths inside will be animated stroke by stroke.
const FILES = [
  "/Untitled/Stroke.svg",   // M (first)
  "/Untitled/Stroke-1.svg", // E
  "/Untitled/Stroke-2.svg", // S (first)
  "/Untitled/Stroke-3.svg", // S (second)
  "/Untitled/Stroke-4.svg", // A
  "/Untitled/Stroke-5.svg", // G
  "/Untitled/Stroke-6.svg", // E (last)
];

export default function GraffitiTitle() {
  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(async () => {
      const svg = containerRef.current;
      if (!svg) return;

      const groups: SVGGElement[] = [];
      const xOffset = 40; // reduced spacing between letters

      for (let i = 0; i < FILES.length; i++) {
        const res = await fetch(FILES[i]);
        const txt = await res.text();
        const temp = document.createElement("div");
        temp.innerHTML = txt;
        const innerSvg = temp.querySelector("svg");
        if (!innerSvg) continue;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("id", `letter-${i}`);
        // Position letters in reverse order so M is at the rightmost position
        // This way when we reverse the groups array, M will be at the leftmost position
        g.setAttribute("transform", `translate(${(FILES.length - 1 - i) * xOffset}, 0)`);

        while (innerSvg.firstChild) {
          g.appendChild(innerSvg.firstChild);
        }
        svg.appendChild(g);
        groups.push(g);
      }

       const master = gsap.timeline({ 
         defaults: { ease: "power1.inOut" },
         delay: 0.5 // Wait for progress bar to complete
       });

       // Reverse the groups array to animate from left to right (M → E → S → S → A → G → E)
       groups.reverse().forEach((group) => {
        const strokes = group.querySelectorAll<SVGPathElement | SVGPolylineElement | SVGLineElement>(
          "path, polyline, line"
        );

        const letterTl = gsap.timeline();

        strokes.forEach((stroke) => {
          const length = (stroke as SVGPathElement).getTotalLength?.() || 300;
          stroke.setAttribute("stroke", "#4ade80");
          stroke.setAttribute("fill", "none");
          stroke.setAttribute("stroke-width", "3");
          stroke.setAttribute("stroke-dasharray", length.toString());
          stroke.setAttribute("stroke-dashoffset", length.toString());

           letterTl.to(stroke, {
             strokeDashoffset: 0,
             duration: 0.3,
            onStart: () => {
              for (let p = 0; p < 8; p++) {
                const dot = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "circle"
                );
                dot.setAttribute("r", (Math.random() * 1.5 + 0.5).toString());
                 dot.setAttribute("fill", "#4ade80");
                group.appendChild(dot);
                gsap.fromTo(
                  dot,
                  {
                    cx: stroke.getPointAtLength(Math.random() * length).x,
                    cy: stroke.getPointAtLength(Math.random() * length).y,
                    opacity: 1,
                  },
                  {
                    cx: "+=" + (Math.random() * 30 - 15),
                    cy: "+=" + (Math.random() * 30 - 15),
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => dot.remove(),
                  }
                );
              }
            },
          });
        });

         letterTl.to(
           strokes,
           {
             fill: "#4ade80",
             stroke: "#4ade80",
             duration: 0.15,
           }
         );

        master.add(letterTl);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={containerRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 80"
      className="inline-block h-[1.8em] w-auto align-baseline"
      style={{  verticalAlign: 'baseline', fontSize: 'inherit' }}
    />
  );
}