import RuleCard from '../components/Rules/RuleCard';
import { NavigationButton } from '../components/NavigationButton';

export function Rules() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        <section className="max-w-5xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Planar Standard Rules
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl">
              Planar Standard is a rotating Magic: the Gathering format built
              around a smaller card pool.
            </p>
          </div>

          <div className="space-y-8">
            {/* Legal Sets */}
            <RuleCard title="Legal Sets">
              <p>
                The following sets are currently legal in Planar Standard:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-200">
                <li>Foundations</li>
                <li>Aetherdrift</li>
                <li>Tarkir: Dragonstorm</li>
                <li>Edge of Eternities</li>
                <li>Lorwyn Eclipsed</li>
              </ul>
            </RuleCard>

            {/* Banlist */}
            <RuleCard title="Banlist">
              <ul className="list-disc list-inside text-gray-200">
                <li>Cori Steel Cutter</li>
              </ul>
            </RuleCard>

            {/* Rotation */}
            <RuleCard title="Rotation Policy">
              <p>
                Planar Standard is intended to always feature the previous two
                years of Universe Within sets.
              </p>
              <p>
                Rotation will coincide with the release of the first set of each
                year.
              </p>
            </RuleCard>

            {/* Scryfall */}
            <RuleCard title="Browse Legal Cards">
              <p>
                Use the Scryfall search below to explore all cards currently
                legal in Planar Standard.
              </p>
              <a
                href="https://scryfall.com/search?q=game%3Apaper+(set%3Aecl+or+set%3Aeoe+or+set%3Atdm+or+set%3Adft+or+set%3Afdn)+-name%3A%22Cori-steel+cutter%22&unique=cards&as=grid&order=color"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg transition-colors"
              >
                Scryfall Search
              </a>
            </RuleCard>
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
