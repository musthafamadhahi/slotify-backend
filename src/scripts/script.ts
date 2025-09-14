import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sports = [
    {
      name: 'Futsal',
      description: 'Indoor 5-a-side football played on a smaller court.',
      icon: '/icons/futsal.png',
      minPlayers: 2,
      maxPlayers: 10,
      estimatedDuration: 50,
    },
    {
      name: 'Cricket (Indoor)',
      description:
        'Modified cricket format played in indoor arenas with smaller teams.',
      icon: '/icons/cricket.png',
      minPlayers: 2,
      maxPlayers: 14,
      estimatedDuration: 90,
    },
    {
      name: 'Badminton',
      description: 'Fast-paced indoor racquet sport played with a shuttlecock.',
      icon: '/icons/badminton.png',
      minPlayers: 2,
      maxPlayers: 4,
      estimatedDuration: 60,
    },
    {
      name: 'Table Tennis',
      description:
        'Indoor game played on a table with paddles and a small ball.',
      icon: '/icons/table-tennis.png',
      minPlayers: 2,
      maxPlayers: 4,
      estimatedDuration: 45,
    },
    {
      name: 'Basketball (Indoor)',
      description: 'Team sport played indoors with 5 players per side.',
      icon: '/icons/basketball.png',
      minPlayers: 2,
      maxPlayers: 10,
      estimatedDuration: 60,
    },

    {
      name: 'Volleyball (Indoor)',
      description: 'Team sport with 6 players per side played indoors.',
      icon: '/icons/volleyball.png',
      minPlayers: 2,
      maxPlayers: 12,
      estimatedDuration: 60,
    },
    {
      name: 'Squash',
      description: 'Indoor racquet sport played in a four-walled court.',
      icon: '/icons/squash.png',
      minPlayers: 2,
      maxPlayers: 2,
      estimatedDuration: 45,
    },
    {
      name: 'Pool Table',
      description:
        'Indoor cue sport played on a pool table with balls and cues.',
      icon: '/icons/pool.png',
      minPlayers: 2,
      maxPlayers: 4,
      estimatedDuration: 30,
    },
  ];

  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: sport,
    });
  }
}

main()
  .then(async () => {
    console.log('✅ Indoor sports seeded successfully');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
