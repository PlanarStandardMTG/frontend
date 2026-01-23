export function ArchetypeMap() {
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden sm:overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Interactive Archetype Map
        </h1>
        <p className="text-gray-300 text-center mb-3 sm:mb-8 max-w-3xl mx-auto text-sm sm:text-base">
          Explore the relationships between different deck archetypes in Planar Standard.
          This interactive visualization shows how strategies connect and compete.
        </p>
        
        <div 
          className="bg-gray-900/75 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-white/15 overflow-hidden overscroll-none"
          onTouchMove={handleTouchMove}
        >
          <iframe
            src="/InteractiveArchetypeMap.html"
            className="w-full h-[98vh] sm:h-[95vh] border-0"
            title="Interactive Archetype Map"
          />
        </div>
      </div>
    </div>
  )
}
