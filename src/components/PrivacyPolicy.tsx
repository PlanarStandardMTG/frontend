import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export function PrivacyPolicy() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-gray-200 text-sm underline transition-colors"
      >
        Privacy Policy
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-white/15">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 text-gray-300 space-y-4 text-left">
              <section>
                <h3 className="text-lg font-semibold text-white mb-2">Information We Collect</h3>
                <p className="mb-2">
                  We collect the following information to provide our services:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Email address - used for account creation and login</li>
                  <li>Password - encrypted and securely stored</li>
                  <li>Challonge account information (if connected) - used to manage tournament participation</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-white mb-2">How We Use Your Information</h3>
                <p className="mb-2">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Account authentication and security</li>
                  <li>If you connect your Challonge account, we use it to join and drop tournaments on your behalf when you request such actions</li>
                  <li>Displaying your match history and tournament performance data</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-white mb-2">Data Protection</h3>
                <p>
                  Your passwords are encrypted and stored securely. We only access connected accounts (such as Challonge) to perform the actions you authorize.
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-white mb-2">Data Deletion</h3>
                <p>
                  You can delete your account and all associated information at any time from the account/login page. This action will remove all your data from our systems.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
