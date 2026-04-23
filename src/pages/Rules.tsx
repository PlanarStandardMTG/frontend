import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { NavigationButton } from '../components/NavigationButton';

interface SetData {
  code: string;
  name: string;
  symbol: {
    common: string;
  };
}

interface BanData {
  cardName: string;
  setCode: string;
}

export function Rules() {
  const [legalSets, setLegalSets] = useState<SetData[]>([]);
  const [bannedCards, setBannedCards] = useState<BanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planarResponse, apiResponse] = await Promise.all([
          fetch('/planar.json'),
          fetch('https://whatsinstandard.com/api/v6/standard.json')
        ]);

        if (!planarResponse.ok || !apiResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const planarData = await planarResponse.json();
        const apiData = await apiResponse.json();

        const planarCodes: string[] = planarData.code;
        const apiSets: SetData[] = apiData.sets;
        const apiBans: BanData[] = apiData.bans;

        // Filter legal sets to those in planar codes
        const filteredLegalSets = apiSets.filter(s => planarCodes.includes(s.code));

        // Filter banned cards to those in planar codes
        const filteredBannedCards = apiBans.filter(b => planarCodes.includes(b.setCode));

        setLegalSets(filteredLegalSets);
        setBannedCards(filteredBannedCards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen text-white">
        <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
          <section className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center">Loading...</div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen text-white">
        <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
          <section className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center text-red-400">Error: {error}</div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        <section className="max-w-5xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Rules & Legality
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl">
              Planar Standard is a rotating Magic: the Gathering format built
              around a smaller card pool.
            </p>
          </div>

          <div className="space-y-8">
            {/* Core Sets */}
            <Card title="Core Sets">
              <div className="grid grid-cols-1 gap-4">
                {legalSets.filter(set => set.code === 'FDN').map(set => (
                  <div key={set.code} className="flex items-center space-x-2">
                    <i className={`ss ss-${set.code.toLowerCase()}`}></i>
                    <span>{set.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rotating Sets */}
            <Card title="Rotating Sets">
              <div className="grid grid-cols-1 gap-4">
                {legalSets.filter(set => set.code !== 'FDN').map(set => (
                  <div key={set.code} className="flex items-center space-x-2">
                    <i className={`ss ss-${set.code.toLowerCase()}`}></i>
                    <span>{set.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Banlist */}
            <Card title="Banlist">
              <ul className="list-disc list-inside text-gray-200">
                {bannedCards.map(card => (
                  <li key={card.cardName}>{card.cardName} ({card.setCode})</li>
                ))}
              </ul>
            </Card>

            {/* Rotation */}
            <Card title="Rotation Policy">
              <p>
                Planar Standard is intended to always feature the previous two years of Universe Within sets.
              </p>
              <p>
                Rotation will coincide with the release of the first Universes Within set of each year.
              </p>
              <p className="italic">
                Foundations (FDN) is excluded from rotation, it is meant to act as a core set of Planar Standard.
              </p>
            </Card>

            {/* Scryfall */}
            <Card title="Browse Legal Cards">
              <p>
                Use the Scryfall search below to explore all cards currently
                legal in Planar Standard.
              </p>
              <a
                href={`https://scryfall.com/search?q=game%3Apaper+(${legalSets.map(s => `set%3A${s.code}`).join('+or+')})${bannedCards.length > 0 ? `+-name%3A%22${bannedCards.map(c => c.cardName.replace(/ /g, '+')).join('%22+-name%3A%22')}%22` : ''}&unique=cards&as=grid&order=color`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg transition-colors"
              >
                Scryfall Search
              </a>
            </Card>
          </div>

          {/* Back */}
          <div className="mt-16 text-center">
            <NavigationButton to="/" variant="secondary">
              Home
            </NavigationButton>
          </div>
        </section>
      </div>
    </div>
  )
}
