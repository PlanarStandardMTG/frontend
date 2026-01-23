import { FaDiscord, FaRedditAlien } from 'react-icons/fa';
import { BlindEternitiesBackground } from '../components/BlindEternitiesBackground';
import { NavigationButton } from '../components/NavigationButton';

export function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <BlindEternitiesBackground />

      <div className="relative z-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Planar Standard
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            A community-driven Magic: the Gathering format built around a smaller,
            faster-rotating card pool and a deep love for the planes of Magic.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {import.meta.env.MODE === 'development' && (
              <NavigationButton to="/dashboard" variant="secondary">
                Dashboard
              </NavigationButton>
            )}

            <NavigationButton to="/tournaments">
              Tournaments
            </NavigationButton>

            <NavigationButton to="/rules">
              View Rules
            </NavigationButton>

            <NavigationButton to="/archetype-map">
              Archetype Map
            </NavigationButton>
          </div>
        </section>

        {/* What is Planar Standard */}
        <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Smaller Card Pool</h3>
            <p className="text-gray-300">
              Legal sets include everything from the last two years, plus
              Foundations.
            </p>
          </div>

          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Shorter Rotation</h3>
            <p className="text-gray-300">
              Faster rotations keep gameplay fresh and accessible, while reducing
              long-term card fatigue.
            </p>
          </div>

          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Planes First</h3>
            <p className="text-gray-300">
              The format centers on Magic’s own worlds and stories, while remaining
              welcoming to everyone who enjoys good games of Magic.
            </p>
          </div>
        </section>

        {/* Community Statement */}
        <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
          <p className="text-lg text-gray-300">
            Planar Standard exists to create fun, engaging Magic experiences.
            Everyone is welcome and preferences differ, the focus stays on
            playing great games and building a healthy, inclusive community.
          </p>
        </section>

        {/* Community Links */}
        <section className="border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-6">Join the Community</h2>
            <p className="text-gray-300 mb-8">
              Discuss decks, share feedback, and help shape the future of
              Planar Standard.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://discord.gg/eeYH9XMCjT"
                rel="noreferrer"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition-colors"
              >
                <FaDiscord className="w-8 h-8" />
              </a>
              <a
                href="https://www.reddit.com/r/planarMTG/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-orange-600 hover:bg-orange-700 font-semibold rounded-lg transition-colors"
              >
                <FaRedditAlien className="w-8 h-8" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
