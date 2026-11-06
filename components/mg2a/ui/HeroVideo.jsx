"use client";

import { useEffect, useRef, useState } from "react";
export default function HeroVideo({ children, ...props }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) video.pause();
      else video.play().catch(() => {});
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return (
    <>
      <video
        {...props}
        ref={ref}
        preload="none"
        muted
        loop
        playsInline
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {children}
      </video>
      <button
        type="button"
        className="mg-video-control absolute [right:clamp(16px,_4vw,_56px)] [bottom:136px] z-[2] w-[44px] h-[44px] rounded-[50%] [border:1px_solid_#ffffff66] [background:#0b18228c] [color:white] inline-flex items-center justify-center p-[0]"
        aria-label={
          playing ? "Pause background video" : "Play background video"
        }
        onClick={() => {
          if (ref.current.paused) ref.current.play().catch(() => {});
          else ref.current.pause();
        }}
      >
        {playing ? (
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
          >
            <rect x="2.5" y="1.5" width="3" height="11" rx="0.5" />
            <rect x="8.5" y="1.5" width="3" height="11" rx="0.5" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
          >
            <path d="M3 1.5L12 7L3 12.5Z" />
          </svg>
        )}
      </button>
    </>
  );
}
