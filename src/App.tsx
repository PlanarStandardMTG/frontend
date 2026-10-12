import { useEffect, useState } from "react";

import { API_BASE_URL, fetchHealth, type Health } from "./api.ts";

type ApiState =
  { kind: "checking" } | { kind: "up"; health: Health } | { kind: "down"; error: string };

/** A placeholder until the event manager's first screens land (EM1). */
export function App() {
  const [api, setApi] = useState<ApiState>({ kind: "checking" });

  useEffect(() => {
    fetchHealth().then(
      (health) => setApi({ kind: "up", health }),
      (error: unknown) =>
        setApi({ kind: "down", error: error instanceof Error ? error.message : String(error) }),
    );
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <img src="/PlanarStandardLogo.png" alt="" className="size-16" />
      <h1 className="font-display text-3xl">Planar Standard Events</h1>
      <p>
        Run a Planar Standard event start to finish: registration, Swiss pairings, results and
        standings. Under construction; the main site is{" "}
        <a className="underline" href="https://www.planarstandard.com">
          planarstandard.com
        </a>
        .
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        API at <code>{API_BASE_URL}</code>: {api.kind === "checking" && "checking…"}
        {api.kind === "up" && `up${api.health.commit ? ` (${api.health.commit.slice(0, 7)})` : ""}`}
        {api.kind === "down" && `unreachable — ${api.error}`}
      </p>
    </main>
  );
}
