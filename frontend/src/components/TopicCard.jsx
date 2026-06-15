import { useState } from 'react';
import { Image, MessageCircle } from 'lucide-react';
import VoteBar from './VoteBar';
import { useAuth } from '../contexts/AuthContext';
import { vote, updateTopicVotes } from '../lib/parse';

const categoryStyles = {
  Politics: 'bg-rose-500/15 text-rose-300',
  Technology: 'bg-sky-500/15 text-sky-300',
  Sports: 'bg-emerald-500/15 text-emerald-300',
  Business: 'bg-amber-500/15 text-amber-300',
  Entertainment: 'bg-fuchsia-500/15 text-fuchsia-300',
  Science: 'bg-violet-500/15 text-violet-300',
};

export default function TopicCard({ topic, onClick, onVoteUpdate }) {
  const { user } = useAuth();
  const [localTopic, setLocalTopic] = useState(topic);
  const [userVotedDirection, setUserVotedDirection] = useState(null);
  const [voting, setVoting] = useState(false);

  const handleVote = async (direction) => {
    if (!user) {
      alert('Please log in to vote');
      return;
    }

    if (voting) return;
    setVoting(true);

    try {
      const result = await vote(localTopic.id, direction, user.sessionToken);
      
      let upDelta = 0;
      let downDelta = 0;

      if (result.action === 'created') {
        if (direction === 'up') upDelta = 1;
        else downDelta = 1;
        setUserVotedDirection(direction);
      } else if (result.action === 'removed') {
        if (direction === 'up') upDelta = -1;
        else downDelta = -1;
        setUserVotedDirection(null);
      } else if (result.action === 'changed') {
        if (direction === 'up') {
          upDelta = 1;
          downDelta = -1;
        } else {
          upDelta = -1;
          downDelta = 1;
        }
        setUserVotedDirection(direction);
      }

      await updateTopicVotes(localTopic.id, upDelta, downDelta, user.sessionToken);

      setLocalTopic((prev) => ({
        ...prev,
        up: Math.max(0, prev.up + upDelta),
        down: Math.max(0, prev.down + downDelta),
      }));

      onVoteUpdate?.(localTopic.id, localTopic.up + upDelta, localTopic.down + downDelta);
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <article
      onClick={() => onClick(localTopic.id)}
      className="group cursor-pointer rounded-2xl border border-edge bg-surface/60 card p-4 hover:border-brand/50 hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${categoryStyles[localTopic.category]}`}>
          {localTopic.category}
        </span>
        <span className="text-xs text-slate-500">{localTopic.source} · {localTopic.age}</span>
      </div>
      <div className="flex gap-3">
        <div className="shrink-0 h-16 w-16 rounded-xl bg-gradient-to-br from-surface2 to-edge grid place-items-center text-slate-600">
          <Image className="h-5 w-5" />
        </div>
        <h3 className="font-semibold leading-snug text-slate-100 group-hover:text-white">{localTopic.title}</h3>
      </div>
      <div className="mt-4">
        <VoteBar
          up={localTopic.up}
          down={localTopic.down}
          onVote={handleVote}
          userVotedDirection={userVotedDirection}
        />
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <MessageCircle className="h-3.5 w-3.5" />
        {localTopic.comments} comments
      </div>
    </article>
  );
}
