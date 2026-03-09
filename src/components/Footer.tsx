import { FaDiscord, FaRedditAlien } from 'react-icons/fa';
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

        <div className="mt-8 pt-8 border-t border-gray-700">
          <PrivacyPolicy />
        </div>
      </div>
    </section>
  );
}
