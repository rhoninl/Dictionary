interface HistoryItem {
    word: string;
    definition: string;
    timestamp: number;
}

interface SearchHistoryProps {
    history: HistoryItem[];
    onRemoveFromHistory: (timestamp: number) => void;
    onSearchWord: (word: string) => void;
}

export default function SearchHistory({ history, onRemoveFromHistory, onSearchWord }: SearchHistoryProps) {
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Search History</h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <div
                        key={item.timestamp}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start">
                            <div
                                className="flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => onSearchWord(item.word)}
                            >
                                <h3 className="text-lg font-medium text-black">{item.word}</h3>
                                <p className="text-gray-600 mt-1">{item.definition}</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => onRemoveFromHistory(item.timestamp)}
                                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Remove from history"
                            >
                                <svg
                                    className="text-gray-400"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 