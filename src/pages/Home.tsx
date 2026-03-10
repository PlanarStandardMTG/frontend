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
        <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Smaller Card Pool</h3>
            <p className="text-gray-300">
              Two years of sets, plus Foundations.
            </p>
          </div>

          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Shorter Rotation</h3>
            <p className="text-gray-300">
              Faster rotations keep gameplay fresh and accessible.
            </p>
          </div>

          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition">
            <h3 className="text-xl font-semibold mb-3">Planes First</h3>
            <p className="text-gray-300">
              Centered on Magic’s own worlds and stories.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24 gap-8">
          <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-6 shadow-2xl ring-1 ring-white/15 hover:ring-white/25 transition md:col-span-3">
            <h3 className="text-xl font-semibold mb-3">Our Philosophy</h3>
            <p className="text-gray-300">
              Planar Standard was born from a desire to see a slower and more sustainable Standard format, in many ways akin to what was known as “Type 2” in the early days of Magic. Although there are several ways to implement this, the course we have taken is through only allowing Universe Within sets from the past two years (as well as Foundations) which effectively limits the available card pool to about a third of what is typically legal in Standard. On top of that, since Universes Within sets typically get Universes Beyond sets between them, this approach also prolongs the time a set can be experimented with and enjoyed. All in all, we believe that this approach to Standard gives the slower and sustainable pace we originally sought for.
            </p>
            <p className="text-gray-300 mt-4">
              We want to emphasize that Planar Standard aims to be defined by what it is, rather than what it is not. We believe Universes Beyond can co-exist with Planar Standard side by side. As such, we reject all forms of inappropriate or hateful anti-Universes Beyond sentiments, in our strife to develop and maintain a format where everyone can feel appreciated and included, regardless of one’s take on Universes Beyond.
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
