import React from 'react';
import Card from '../components/Card';

export function ArchetypeMap() {
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        <section className="max-w-5xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              The Archetype Map
            </h1>
          </div>

          <div className="space-y-8">
            {/* Archetype Map */}
            <Card title="Archetype Map">
              <p>
                This interactive archetype map features 290 decks sorted into 88 clusters based on similarities in their card compositions. 
                Decks that share more cards, and therefore likely follow similar strategies, are positioned closer together, while more distinct decks appear further apart. 
                Hovering over a deck reveals its full list, performance record, and event information. 
                The legend to the right can also be interacted with to display only a few decks at the time, for easier identification in the map. 
                Lastly, use the control in the upper right hand side of the window to zoom and move around in the map.
              </p>
            </Card>

            <div
              className="bg-gray-900/75 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-white/15 overflow-hidden overscroll-none"
              onTouchMove={handleTouchMove}
            >
              <iframe
                src="/InteractiveArchetypeMap.html"
                className="w-full h-[80vh] sm:h-[75vh] border-0"
                title="Interactive Archetype Map"
              />
            </div>

            {/* Back */}
            <div className="mt-16 text-center">
              <a
                href="/meta"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-white ring-1 ring-white/20"
              >
                Back to Meta
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
