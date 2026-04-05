import { FaDiscord, FaRedditAlien, FaTwitch, FaYoutube, FaPatreon, FaCoffee, FaTrophy } from 'react-icons/fa';
import { PrivacyPolicy } from './PrivacyPolicy';

export function Footer() {
  return (
    <section className="border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Join the Community</h2>
        <p className="text-gray-300 mb-8">
          Discuss decks, share feedback, and help shape the future of
          Planar Standard.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://discord.gg/eeYH9XMCjT"
            rel="noreferrer"
            target="_blank"
            className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition-colors"
          >
            <FaDiscord className="w-6 h-6" />
          </a>
          <a
            href="https://www.reddit.com/r/planarMTG/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 bg-orange-600 hover:bg-orange-700 font-semibold rounded-lg transition-colors"
          >
            <FaRedditAlien className="w-6 h-6" />
          </a>
          <a
            href="https://www.twitch.tv/planarstandardmtg"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 bg-purple-600 hover:bg-purple-700 font-semibold rounded-lg transition-colors"
          >
            <FaTwitch className="w-6 h-6" />
          </a>
          <a
            href="https://challonge.com/communities/planarstandardmtg"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 bg-green-600 hover:bg-green-700 font-semibold rounded-lg transition-colors"
          >
            <FaTrophy className="w-6 h-6" />
          </a>
          <a
            href="https://www.youtube.com/@PlanarStandardMTG"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 bg-red-600 hover:bg-red-700 font-semibold rounded-lg transition-colors"
          >
            <FaYoutube className="w-6 h-6" />
          </a>
          <a
            href="https://www.patreon.com/cw/PlanarMTG"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 bg-pink-600 hover:bg-pink-700 font-semibold rounded-lg transition-colors"
          >
            <FaPatreon className="w-6 h-6" />
          </a>
          <a
            href="https://ko-fi.com/planarmtg"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors"
          >
            <FaCoffee className="w-6 h-6" />
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <PrivacyPolicy />
        </div>
      </div>
    </section>
  );
}
