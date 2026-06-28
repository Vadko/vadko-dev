const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
};

async function fetchJson(url) {
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

export async function onRequestGet() {
  try {
    const [repo, gamesCount, releases] = await Promise.all([
      fetchJson('https://api.github.com/repos/Vadko/lbk-launcher'),
      fetchJson('https://lbklauncher.com/api/games-count'),
      fetchJson('https://lbklauncher.com/api/github-releases'),
    ]);

    return new Response(
      JSON.stringify({
        stars: repo.stargazers_count,
        games: gamesCount.count,
        downloads: releases.totalDownloads,
        updatedAt: new Date().toISOString(),
      }),
      { headers },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to load stats',
        message: error instanceof Error ? error.message : String(error),
      }),
      { status: 502, headers },
    );
  }
}
