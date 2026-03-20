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
                Planar Standard can appropriately be called a brewer’s paradise, as games typically last until later turns (5-7) before a win is secured. This leaves lot of rooms to experiment with different strategies which otherwise couldn’t see play in normal Standard. 
                
                Before you go brewing an obscure combo deck, however, be aware that aggressive decks also exist which seeks to prey on those who might underestimate the still competitive environment – both RDW (Red Deck Wins), traditional burn, and green Stompy decks will need to be dealt with in a timely manner. 
                
                If your flavor is grindy midrange value piles or more controlling archetypes, mono black or Ugin shells are more than happy to welcome you to their abodes.
              </p>
            </Card>

            <div className="text-lg mb-3 leading-relaxed text-gray-300">
              <p>
                Follow these links to see detailed documentation of the meta:
              </p>
            </div>

            {/* Map + Drive Links */}
            <section className="flex flex-wrap justify-center gap-4 mx-10">
              <NavigationButton href="https://drive.google.com/drive/folders/148ovnHBmpz9sXJz6wumRsrW18pcs5n2F?usp=drive_link">
                Season: 1
              </NavigationButton>
              <NavigationButton href="https://drive.google.com/drive/folders/1_GfHy-c6Orxxbc5p9aZgXoeGLG_o1vb3?usp=drive_link">
                Season: beta
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
