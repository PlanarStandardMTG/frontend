export function ArchetypeMap() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Interactive Archetype Map
        </h1>
        <p className="text-gray-300 text-center mb-8 max-w-3xl mx-auto">
          Explore the relationships between different deck archetypes in Planar Standard.
          This interactive visualization shows how strategies connect and compete.
        </p>
        
        <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-white/15 overflow-hidden">
          <iframe
            src="/InteractiveArchetypeMap.html"
            className="w-full h-[calc(100vh-16rem)] border-0"
            title="Interactive Archetype Map"
          />
        </div>
      </div>
    </div>
  )
}
