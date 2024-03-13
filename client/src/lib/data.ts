export type LevelAndTheme = {
  level: number;
  cardTheme: string;
};

export type PokemonData = {
  imageUrl: string;
  name: string;
};

export type PokemonAPI = {
  name: string;
  sprites: { front_default: string };
};

export type GameProgressData = {
  token: string;
  level: number;
  star: number;
  score: number;
  completedTime: number;
  totalClick: number;
  sound: boolean;
};

export type topPlayerData = {
  username: string;
  level: number;
  score: number;
  totalClicked: number;
  star: number;
  completedTime: number;
};

export async function addLevelAndTheme(
  token: string,
  levelAndTheme: LevelAndTheme
): Promise<LevelAndTheme> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(levelAndTheme),
  };

  const res = await fetch('/api/level-and-theme', req);

  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function updateLevelOnDB(
  token: string,
  newLevel: number
): Promise<LevelAndTheme> {
  const req = {
    method: 'Put',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ level: newLevel }),
  };

  const res = await fetch('/api/update-level', req);

  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function updateGameProgressData(
  token: string,
  currentLevel: number,
  numStars: number,
  rawScore: number,
  timeCompleted: number,
  numClicked: number,
  sound: boolean
): Promise<GameProgressData> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      level: currentLevel,
      star: numStars,
      score: rawScore,
      completedTime: timeCompleted,
      totalClick: numClicked,
      sound,
    }),
  };

  const res = await fetch('/api/update-user-game-progress', req);

  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function getLevelAndTheme(token: string): Promise<LevelAndTheme> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch('api/level-and-theme', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function getTopPlayers(token: string): Promise<topPlayerData[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch('/api/leadership-board', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchPokemonData(): Promise<PokemonData[]> {
  const promises: Promise<PokemonData>[] = [];
  for (let i = 1; i <= 9; i++) {
    const min = 1;
    const max = 1000;
    const randomID = Math.floor(Math.random() * (max - min + 1)) + min;
    const url = `https://pokeapi.co/api/v2/pokemon/${randomID}`;
    const promise = fetch(url)
      .then((res) => res.json())
      .then((data: PokemonAPI) => ({
        name: data.name,
        imageUrl: data.sprites['front_default'],
      }));
    promises.push(promise);
  }

  return Promise.all(promises);
}
