import { useState, useEffect } from 'react';

interface WordDefinitionProps {
    word: string;
    onSaveToHistory: (word: string, definition: string) => void;
}

interface Definition {
    definition: string;
    example?: string;
    synonyms?: string[];
}

interface WordData {
    phonetic: string;
    phonetics: Array<{
        text: string;
        audio: string;
    }>;
    meanings: Array<{
        partOfSpeech?: string;
        definitions: Array<{
            definition: string;
            example?: string;
            synonyms?: string[];
        }>;
    }>;
}

export default function WordDefinition({ word, onSaveToHistory }: WordDefinitionProps) {
    const [definitions, setDefinitions] = useState<Definition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [phonetic, setPhonetic] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [partOfSpeech, setPartOfSpeech] = useState<string>('');

    useEffect(() => {
        const fetchDefinition = async () => {
            if (!word) return;

            setLoading(true);
            setError(null);
            setSaved(false);

            try {
                const response = await fetch(`/api/${word}`);
                if (!response.ok) {
                    throw new Error('Word not found');
                }

                const data: WordData[] = await response.json();
                const wordData = data[0];

                // Get phonetic text
                setPhonetic(wordData.phonetic || '');

                // Get audio URL
                const audioPhonetic = wordData.phonetics.find(p => p.audio)?.audio;
                if (audioPhonetic) {
                    setAudioUrl(audioPhonetic);
                }

                // Get part of speech
                if (wordData.meanings[0]?.partOfSpeech) {
                    setPartOfSpeech(wordData.meanings[0].partOfSpeech);
                }

                const meanings = wordData.meanings;
                const defs = meanings.flatMap((meaning) =>
                    meaning.definitions.map((def) => ({
                        definition: def.definition,
                        example: def.example,
                        synonyms: def.synonyms
                    }))
                );

                setDefinitions(defs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch definition');
            } finally {
                setLoading(false);
            }
        };

        fetchDefinition();
    }, [word]);

    const handleSave = () => {
        if (definitions.length > 0) {
            onSaveToHistory(word, definitions[0].definition);
            setSaved(true);
        }
    };

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    if (loading) {
        return <div className="text-center py-4 text-black">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (!word) {
        return null;
    }

    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold capitalize text-black">{word}</h2>
                        {partOfSpeech && (
                            <span className="text-gray-500 italic">({partOfSpeech})</span>
                        )}
                    </div>
                    {phonetic && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-black font-mono text-lg">{phonetic}</span>
                            {audioUrl && (
                                <button
                                    onClick={playAudio}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Listen to pronunciation"
                                >
                                    <svg
                                        className="text-blue-600"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title={saved ? "Saved to history" : "Save to history"}
                >
                    {saved ? (
                        <svg
                            className="text-green-500"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            <polyline points="9 7 12 10 15 7" />
                        </svg>
                    ) : (
                        <svg
                            className="text-gray-500"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="space-y-4">
                {definitions.map((def, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                        <p className="text-black">{def.definition}</p>
                        {def.example && (
                            <p className="mt-2 text-black italic">&ldquo;{def.example}&rdquo;</p>
                        )}
                        {def.synonyms && def.synonyms.length > 0 && (
                            <div className="mt-2">
                                <span className="text-black">Synonyms: </span>
                                <span className="text-blue-600">{def.synonyms.join(', ')}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 