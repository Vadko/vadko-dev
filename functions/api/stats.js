const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
};

const fallbackStats = {
  lbk: {
    stars: 69,
    games: 772,
    downloads: 298678,
  },
  fileViewer: {
    stars: 49,
    forks: 6,
    version: '0.7.5',
    monthlyDownloads: 39500,
  },
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

async function fetchJsonOrNull(url) {
  try {
    return await fetchJson(url);
  } catch {
    return null;
  }
}

function numberOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function stringOr(value, fallback) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export async function onRequestGet() {
  try {
    const [
      lbkRepo,
      gamesCount,
      releases,
      fileViewerRepo,
      fileViewerPackage,
      fileViewerDownloads,
    ] = await Promise.all([
      fetchJsonOrNull('https://api.github.com/repos/Vadko/lbk-launcher'),
      fetchJsonOrNull('https://lbklauncher.com/api/games-count'),
      fetchJsonOrNull('https://lbklauncher.com/api/github-releases'),
      fetchJsonOrNull('https://api.github.com/repos/Vadko/react-native-file-viewer-turbo'),
      fetchJsonOrNull('https://registry.npmjs.org/react-native-file-viewer-turbo/latest'),
      fetchJsonOrNull('https://api.npmjs.org/downloads/point/last-month/react-native-file-viewer-turbo'),
    ]);

    return new Response(
      JSON.stringify({
        stars: numberOr(lbkRepo?.stargazers_count, fallbackStats.lbk.stars),
        games: numberOr(gamesCount?.count, fallbackStats.lbk.games),
        downloads: numberOr(releases?.totalDownloads, fallbackStats.lbk.downloads),
        fileViewer: {
          stars: numberOr(fileViewerRepo?.stargazers_count, fallbackStats.fileViewer.stars),
          forks: numberOr(fileViewerRepo?.forks_count, fallbackStats.fileViewer.forks),
          version: stringOr(fileViewerPackage?.version, fallbackStats.fileViewer.version),
          monthlyDownloads: numberOr(fileViewerDownloads?.downloads, fallbackStats.fileViewer.monthlyDownloads),
        },
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
