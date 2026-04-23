import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { API_BASE_URL } from '../types/Api'
import { sanitizeText } from '../utils/security'
import type { LeaderboardEntryDTO, LeaderboardResponseDTO } from '../types/Leaderboard'

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntryDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [limit] = useState(10) // fixed page size for now
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // no auth required for this endpoint; include the iframe header for AJAX
        const headers: Record<string, string> = {
          'X-Requested-With': 'XMLHttpRequest'
        }

        const res = await fetch(
          `${API_BASE_URL}/api/leaderboard?page=${page}&limit=${limit}`,
          {
            headers,
            credentials: 'same-origin',
          }
        )
        const data = await res.json()

        if (!res.ok) {
          throw new Error(sanitizeText(data.message || 'Failed to load leaderboard'))
        }

        const body = data as LeaderboardResponseDTO
        setEntries(body.leaderboard || [])
        setTotalPages(body.pagination?.totalPages || 1)
      } catch (err) {
        const msg = err instanceof Error ? sanitizeText(err.message) : 'Failed to load leaderboard'
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [page, limit])

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        <section className="max-w-5xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Leaderboard
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl">
              Check out the top-ranked players in Planar Standard!
            </p>
            <p className="text-lg text-gray-300 max-w-3xl">
              Rankings are based on ELO ratings calculated from our monthly tournaments.
            </p>
          </div>

          {isLoading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!isLoading && !error && (
            <>
              <Card title="Rankings">
                {/* pagination controls */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400 text-sm">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded text-sm"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                  {/* page numbers */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {(() => {
                      const pageNumbers = [];
                      for (let i = 1; i <= totalPages; i++) {
                        pageNumbers.push(i);
                      }

                      return pageNumbers.map((number) => (
                        <button
                          key={number}
                          onClick={() => setPage(number)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            page === number
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          {number}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
                {/* desktop/tablet view */}
                <div className="hidden sm:overflow-x-auto sm:block">
                  <table className="w-full table-auto bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
                    <thead>
                      <tr className="text-left text-gray-300">
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Player</th>
                        <th className="px-4 py-2">ELO</th>
                        {/* <th className="px-4 py-2">Matches</th>
                        <th className="px-4 py-2">W</th>
                        <th className="px-4 py-2">L</th> */}
                        <th className="px-4 py-2">Win %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e, index) => {
                        // const losses = e.totalLosses ?? (e.totalMatches - e.totalWins)
                        const winRate = (e.totalWins / Math.max(e.totalMatches, 1)) * 100
                        return (
                          <tr key={e.id} className="border-t border-gray-700 even:bg-gray-900/40">
                            <td className="px-4 py-2">{index + 1 + (page - 1) * limit}</td>
                            <td className="px-4 py-2">{e.username}</td>
                            <td className="px-4 py-2">{e.elo}</td>
                            {/* <td className="px-4 py-2">{e.totalMatches}</td>
                            <td className="px-4 py-2">{e.totalWins}</td>
                            <td className="px-4 py-2">{losses}</td> */}
                            <td className="px-4 py-2">{winRate.toFixed(2)}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* mobile view: card list */}
                <div className="sm:hidden space-y-4">
                  {entries.map((e, index) => {
                    // const losses = e.totalLosses ?? (e.totalMatches - e.totalWins)
                    const winRate = (e.totalWins / Math.max(e.totalMatches, 1)) * 100
                    return (
                      <div
                        key={e.id}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-lg">#{index + 1 + (page - 1) * limit}</span>
                          <span className="text-yellow-400 font-semibold">{e.elo}</span>
                        </div>
                        <div className="text-white font-semibold mb-2">{e.username}</div>
                        <div className="text-gray-400 text-sm space-y-1">
                          {/* <div>Matches: {e.totalMatches}</div> */}
                          {/* <div>Wins: {e.totalWins}</div>
                          <div>Losses: {losses}</div> */}
                          <div>Win %: {winRate.toFixed(2)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {entries.length === 0 && (
                  <p className="text-gray-400">No ranked players found.</p>
                )}
              </Card>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
