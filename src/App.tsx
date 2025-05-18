import { useState, useEffect } from 'react';
import DictionarySearch from './components/DictionarySearch';
import WordDefinition from './components/WordDefinition';
import SearchHistory from './components/SearchHistory';

interface HistoryItem {
  word: string;
  definition: string;
  timestamp: number;
}

export default function App() {
  const [searchWord, setSearchWord] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    // Initialize state from localStorage
    try {
      const savedHistory = localStorage.getItem('dictionaryHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          return parsedHistory;
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
    return [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('dictionaryHistory', JSON.stringify(history));
        console.log('History saved:', history); // Debug log
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }
  }, [history]);

  const handleSearch = (word: string) => {
    setSearchWord(word);
  };

  const handleSaveToHistory = (word: string, definition: string) => {
    console.log('Saving to history:', word, definition); // Debug log

    const newItem = {
      word,
      definition,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Check if word already exists in history
      const exists = prev.some(item => item.word.toLowerCase() === word.toLowerCase());
      if (exists) {
        // If exists, update the existing entry
        const updated = prev.map(item =>
          item.word.toLowerCase() === word.toLowerCase()
            ? { ...item, definition, timestamp: Date.now() }
            : item
        );
        console.log('Updated history:', updated); // Debug log
        return updated;
      }
      // If not exists, add new entry at the beginning
      const updated = [newItem, ...prev];
      console.log('New history:', updated); // Debug log
      return updated;
    });
  };

  const handleRemoveFromHistory = (timestamp: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.timestamp !== timestamp);
      console.log('Removed from history:', updated); // Debug log
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">English Dictionary</h1>

        <div className="max-w-4xl mx-auto">
          <DictionarySearch onSearch={handleSearch} />

          {searchWord && (
            <WordDefinition
              word={searchWord}
              onSaveToHistory={handleSaveToHistory}
            />
          )}

          <SearchHistory
            history={history}
            onRemoveFromHistory={handleRemoveFromHistory}
            onSearchWord={handleSearch}
          />
        </div>
      </main>
    </div>
  );
}
