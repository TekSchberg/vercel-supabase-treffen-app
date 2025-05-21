import { useState, useEffect } from 'react';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [gym, setGym] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchEntries() {
    const res = await fetch('/api/entries');
    const data = await res.json();
    setEntries(data);
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, time, gym }),
    });

    if (res.ok) {
      setName('');
      setTime('');
      setGym(false);
      await fetchEntries();
    } else {
      alert('Fehler beim Eintragen');
    }

    setLoading(false);
  }

  return (
    <main className="max-w-md mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Treffen planen für Heute</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={gym}
            onChange={(e) => setGym(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Ich komme ins Gym</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-300"
        >
          {loading ? 'Speichern...' : 'Eintragen'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Alle Einträge heute</h2>
      <ul className="space-y-2">
        {entries.length === 0 && <li>Keine Einträge</li>}
        {entries.map(({ id, name, time, gym }) => (
          <li key={id} className="border-b pb-1">
            <strong>{name}</strong> um {time} {gym && '🏋️‍♂️'}
          </li>
        ))}
      </ul>
    </main>
  );
}
