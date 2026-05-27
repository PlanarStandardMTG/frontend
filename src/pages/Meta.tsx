import Card from '../components/Card';
import { NavigationButton } from '../components/NavigationButton';

export function Meta() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        <section className="max-w-5xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              The "Meta"
            </h1>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card title="Overview">
              <p>
                Planar Standard is largely an unsolved format, where new deck strategies pop up from week to week. 
                On average, games last until later turns (turns 6-8) but can also go faster or slower depending on specific match-ups. 
                This leaves a lot of room to experiment with different strategies which otherwise couldn't see play in regular Standard. 
                Both aggro and control decks are viable, with plenty of additional sub-archetypes.
              </p>
            </Card>

            <div className="text-lg mb-3 leading-relaxed text-gray-300">
              <p>
                Follow these links to see detailed documentation of the meta:
              </p>
            </div>

            {/* Map + Drive Links */}
            <section className="flex flex-wrap justify-center gap-4 mx-10">
              <NavigationButton href="https://drive.google.com/file/d/1m17hWxGL93RzRZQr3BcgTtHkyILmk9CK/view">
                Season I (Lorwyn Eclipsed/Jan - Apr 2026)
              </NavigationButton>
            </section>

            <div className="text-lg mb-3 leading-relaxed text-gray-300">
              <p>
                Explore the archetype map below to see how different decks relate to each other:
              </p>
            </div>

            {/* Map */}
            <section className="flex flex-wrap justify-center gap-4 mx-10">
              <NavigationButton to="/archetype-map">
                Archetype Map
              </NavigationButton>
            </section>
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
