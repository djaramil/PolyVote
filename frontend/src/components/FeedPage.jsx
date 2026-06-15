import TopicCard from './TopicCard';
import { useTopics } from '../hooks/useTopics';

export default function FeedPage({ onTopicClick }) {
  const { topics, loading, error } = useTopics();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center text-slate-400">Loading topics...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center text-red-400">Error loading topics: {error.message}</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center gap-2 mb-5 text-sm">
        <span className="text-slate-400">Sort</span>
        <button className="px-3 py-1.5 rounded-lg bg-surface2 border border-edge">Newest</button>
        <button className="px-3 py-1.5 rounded-lg hover:bg-surface2 border border-transparent">Most Votes</button>
        <button className="px-3 py-1.5 rounded-lg hover:bg-surface2 border border-transparent">Most Controversial</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onClick={onTopicClick} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="px-5 py-2.5 rounded-xl border border-edge bg-surface/60 card hover:bg-surface2 text-sm">
          Load more
        </button>
      </div>
    </main>
  );
}
