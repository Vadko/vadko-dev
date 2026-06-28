interface LbkStats {
  stars: number;
  games: number;
  downloads: number;
  updatedAt: string;
}

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'vadko-dev-stats',
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}

export const onRequestGet = async (): Promise<Response> => {
  try {
    const [repo, gamesCount, releases] = await Promise.all([
      fetchJson<{ stargazers_count: number }>('https://api.github.com/repos/Vadko/lbk-launcher'),
      fetchJson<{ count: number }>('https://lbklauncher.com/api/games-count'),
      fetchJson<{ totalDownloads: number }>('https://lbklauncher.com/api/github-releases'),
    ]);

    const stats: LbkStats = {
      stars: repo.stargazers_count,
      games: gamesCount.count,
      downloads: releases.totalDownloads,
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(stats), { headers });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to load stats',
        message: error instanceof Error ? error.message : String(error),
      }),
      { status: 502, headers },
    );
  }
};
