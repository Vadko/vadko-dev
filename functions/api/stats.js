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
    const [
      lbkRepo,
      gamesCount,
      releases,
      fileViewerRepo,
      fileViewerPackage,
      fileViewerDownloads,
    ] = await Promise.all([
      fetchJson('https://api.github.com/repos/Vadko/lbk-launcher'),
      fetchJson('https://lbklauncher.com/api/games-count'),
      fetchJson('https://lbklauncher.com/api/github-releases'),
      fetchJson('https://api.github.com/repos/Vadko/react-native-file-viewer-turbo'),
      fetchJson('https://registry.npmjs.org/react-native-file-viewer-turbo/latest'),
      fetchJson('https://api.npmjs.org/downloads/point/last-month/react-native-file-viewer-turbo'),
    ]);

    return new Response(
      JSON.stringify({
        stars: lbkRepo.stargazers_count,
        games: gamesCount.count,
        downloads: releases.totalDownloads,
        fileViewer: {
          stars: fileViewerRepo.stargazers_count,
          forks: fileViewerRepo.forks_count,
          version: fileViewerPackage.version,
          monthlyDownloads: fileViewerDownloads.downloads,
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
