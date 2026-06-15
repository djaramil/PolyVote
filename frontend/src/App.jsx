import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import FeedPage from './components/FeedPage';

function App() {
  const handleTopicClick = (id) => {
    console.log('Topic clicked:', id);
  };

  return (
    <AuthProvider>
      <div className="font-sans text-slate-200 min-h-screen antialiased">
        <Navbar />
        <FeedPage onTopicClick={handleTopicClick} />
      </div>
    </AuthProvider>
  );
}

export default App;
