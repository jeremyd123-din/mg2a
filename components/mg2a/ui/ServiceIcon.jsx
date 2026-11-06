import { stegaClean } from "next-sanity";
const icons = {
  survey: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="15" y="6" width="14" height="9" rx="2"></rect>
      <path d="M22 15V20M22 20L12 38M22 20L32 38M22 20V38"></path>
      <circle cx="22" cy="10.5" r="2"></circle>
    </svg>
  ),
  design: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="8" width="32" height="28" rx="2"></rect>
      <path d="M6 16H38M14 8V36"></path>
      <path d="M20 30L30 20M30 20H24M30 20V26"></path>
    </svg>
  ),
  water: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 6C22 6 12 18 12 25C12 30.5 16.5 35 22 35C27.5 35 32 30.5 32 25C32 18 22 6 22 6Z"></path>
      <path d="M6 39C10 37 14 37 18 39C22 41 26 41 30 39C34 37 38 37 40 38"></path>
    </svg>
  ),
  permitting: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5H27L34 12V39H11Z"></path>
      <path d="M27 5V12H34"></path>
      <path d="M16 26L20.5 30.5L29 21"></path>
    </svg>
  ),
  construction: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8V38"></path>
      <path d="M18 8L32 12.5L18 17"></path>
      <path d="M14 38L18 32L22 38"></path>
      <path d="M6 38H38"></path>
    </svg>
  ),
  documentation: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="12" y="6" width="24" height="30" rx="2"></rect>
      <path d="M8 11V40H30"></path>
      <path d="M17 14H31M17 20H31M17 26H25"></path>
    </svg>
  ),
  cost: (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="[stroke:var(--accent)]"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="10" y="5" width="24" height="34" rx="2"></rect>
      <rect x="14" y="9" width="16" height="7" rx="1"></rect>
      <path d="M15 22H17M21 22H23M27 22H29M15 28H17M21 28H23M27 28H29M15 34H17M21 34H23M27 34H29"></path>
    </svg>
  ),
};
export default function ServiceIcon({ name }) {
  return icons[stegaClean(name)] || icons.survey;
}
