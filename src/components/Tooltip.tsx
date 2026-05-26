import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipContent {
  what: string;
  normal: string;
  low: string;
  high: string;
}

interface Props {
  content: TooltipContent;
}

export default function Tooltip({ content }: Props) {
  const [visible, setVisible] = useState(false);
  const [above, setAbove] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipH = tooltipRef.current.offsetHeight || 220;
    setAbove(rect.bottom + tooltipH + 8 > window.innerHeight);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    function onClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [visible]);

  return (
    <span className="relative inline-flex ml-1.5">
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        className="text-gray-500 hover:text-sky-400 transition-colors focus:outline-none"
        aria-label="Parameter info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute left-1/2 -translate-x-1/2 z-50 w-72 rounded-xl shadow-2xl border border-gray-700 bg-gray-950 text-xs text-gray-300 p-0 overflow-hidden pointer-events-none ${
            above ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          role="tooltip"
        >
          {/* Header */}
          <div className="bg-gray-800 px-3 py-2 text-gray-200 font-medium border-b border-gray-700 text-xs leading-snug">
            {content.what}
          </div>
          <div className="divide-y divide-gray-800">
            <div className="px-3 py-2">
              <span className="text-emerald-400 font-semibold block mb-0.5">Normal</span>
              <span className="text-gray-400 leading-relaxed">{content.normal}</span>
            </div>
            <div className="px-3 py-2">
              <span className="text-sky-400 font-semibold block mb-0.5">Low</span>
              <span className="text-gray-400 leading-relaxed">{content.low}</span>
            </div>
            <div className="px-3 py-2">
              <span className="text-rose-400 font-semibold block mb-0.5">High</span>
              <span className="text-gray-400 leading-relaxed">{content.high}</span>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
