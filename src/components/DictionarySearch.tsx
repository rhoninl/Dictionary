import { useState } from 'react';

interface DictionarySearchProps {
    onSearch: (word: string) => void;
}

export default function DictionarySearch({ onSearch }: DictionarySearchProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        const trimmedWord = inputValue.trim();
        if (trimmedWord) {
            onSearch(trimmedWord);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a word..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Search
                </button>
            </div>
        </div>
    );
} 