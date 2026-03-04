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
              Our Shifting Meta
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

            {/* Archetype Map */}
            <Card title="Archetype Map">
              <p>
                The interactive archetype map features XXX decks, sorted into XX clusters based on similarities in their card compositions. Decks that share more cards — and therefore likely follow similar strategies — are positioned closer together, while more distinct decks appear further apart. 
                
                Colors represent archetypes, node size reflects connectivity to similar decks, and hovering over a deck reveals its full list, performance record, and event information. 
                
                The legend to the right can also be interacted with to display only a few decks at the time, for easier identification in the map. Lastly, use the control in the upper right of the window to zoom in and out of the map. 
                
                {/* If you want to copy any of these deck lists into Arena or a tabletop simulator of your choice, find them in the Google Drive folder linked below: */}
              </p>
              <div className="mt-4 mx-16 text-center">
                <NavigationButton to="/archetype-map">
                  Archetype Map
                </NavigationButton>
              </div>
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
