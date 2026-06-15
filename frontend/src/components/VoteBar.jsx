import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function VoteBar({ up, down, big = false }) {
  const total = up + down;
  const percentage = total > 0 ? Math.round((up / total) * 100) : 0;
  const h = big ? 'h-2.5' : 'h-2';
  const textSize = big ? 'text-sm' : 'text-xs';
  const iconSize = big ? 'h-4 w-4' : 'h-3.5 w-3.5';
  const subTextSize = big ? 'text-xs' : 'text-[11px]';

  return (
    <>
      <div className={`flex items-center gap-3 ${textSize}`}>
        <span className="inline-flex items-center gap-1 text-up font-semibold">
          <ThumbsUp className={iconSize} />
          {up}
        </span>
        <div className={`flex-1 ${h} rounded-full bg-down/30 overflow-hidden`}>
          <div className={`${h} rounded-full bg-up`} style={{ width: `${percentage}%` }} />
        </div>
        <span className="inline-flex items-center gap-1 text-down font-semibold">
          {down}
          <ThumbsDown className={iconSize} />
        </span>
      </div>
      <div className={`mt-1 ${subTextSize} text-slate-400`}>{percentage}% agree</div>
    </>
  );
}
