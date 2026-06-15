import { Image, MessageCircle } from 'lucide-react';
import VoteBar from './VoteBar';

const categoryStyles = {
  Politics: 'bg-rose-500/15 text-rose-300',
  Technology: 'bg-sky-500/15 text-sky-300',
  Sports: 'bg-emerald-500/15 text-emerald-300',
  Business: 'bg-amber-500/15 text-amber-300',
  Entertainment: 'bg-fuchsia-500/15 text-fuchsia-300',
  Science: 'bg-violet-500/15 text-violet-300',
};

export default function TopicCard({ topic, onClick }) {
  return (
    <article
      onClick={() => onClick(topic.id)}
      className="group cursor-pointer rounded-2xl border border-edge bg-surface/60 card p-4 hover:border-brand/50 hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${categoryStyles[topic.category]}`}>
          {topic.category}
        </span>
        <span className="text-xs text-slate-500">{topic.source} · {topic.age}</span>
      </div>
      <div className="flex gap-3">
        <div className="shrink-0 h-16 w-16 rounded-xl bg-gradient-to-br from-surface2 to-edge grid place-items-center text-slate-600">
          <Image className="h-5 w-5" />
        </div>
        <h3 className="font-semibold leading-snug text-slate-100 group-hover:text-white">{topic.title}</h3>
      </div>
      <div className="mt-4">
        <VoteBar up={topic.up} down={topic.down} />
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <MessageCircle className="h-3.5 w-3.5" />
        {topic.comments} comments
      </div>
    </article>
  );
}
