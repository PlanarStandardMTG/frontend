import { BlindEternitiesBackground } from '../components/BlindEternitiesBackground';
import { Footer } from '../components/Footer';
import { NavigationButton } from '../components/NavigationButton';

export function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <BlindEternitiesBackground />

      <div className="relative z-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            PLANAR STANDARD
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            A community-driven Magic: the Gathering format built around a smaller,
            faster-rotating card pool.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-20">
            {import.meta.env.MODE === 'development' && (
              <NavigationButton to="/dashboard" variant="secondary">
                Dashboard
              </NavigationButton>
            )}

            {/* <NavigationButton to="/leaderboard">
              Leaderboard
            </NavigationButton> */}

            <NavigationButton to="/tournaments">
              Tournaments
            </NavigationButton>

            <NavigationButton to="/legality">
              Legality
            </NavigationButton>

            <NavigationButton to="/meta">
              Meta
            </NavigationButton>
          </div>
        </section>

        {/* What is Planar Standard */}
        <section className="max-w-4xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Smaller Card Pool</h3>
            <p className="text-gray-300">
              Two years of sets, plus Foundations. Quicker rotations keep the format fresh.
            </p>
          </div>

          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
            <p className="text-gray-300">
              A format run by the players with community tournaments happening weekly and monthly.
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

        <Footer />
      </div>
    </div>
  )
}
