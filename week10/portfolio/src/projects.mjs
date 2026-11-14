export const projects = [
  {
    id: 'memory',
    title: 'Memory Match',
    category: 'JavaScript / team project',
    description: 'A memory game with timed rounds, hints and a local two-player mode.',
    technologies: ['JavaScript', 'CSS'],
    githubUrl: 'https://github.com/sudip09-sys/WebProgramming/tree/main/teamproject',
    demoUrl: '../../teamproject/',
    features: [
      'Separate engine and rendering code.',
      'Preview, matching, hints and score tracking.',
      'Practice, timed and two-player modes.',
    ],
  },
  {
    id: 'books',
    title: 'Book Search',
    category: 'Open Library / Fetch API',
    description:
      'Search for a book, browse its cover and publication details, and recover from a failed request.',
    technologies: ['JavaScript', 'API', 'CSS'],
    githubUrl: 'https://github.com/sudip09-sys/WebProgramming/tree/main/week10/book-search',
    demoUrl: '../book-search/',
    features: [
      'Search queries are encoded before requests.',
      'Loading, empty and error states.',
      'A layout that works on smaller screens.',
    ],
  },
  {
    id: 'jokes',
    title: 'JokeLab',
    category: 'Async JavaScript / local storage',
    description:
      'A small joke app where I worked on fetching data, timeout feedback and saving favourites.',
    technologies: ['JavaScript', 'API', 'CSS'],
    githubUrl: 'https://github.com/sudip09-sys/WebProgramming/tree/main/week6/jokelab',
    demoUrl: '../../week6/jokelab/',
    features: [
      'Programming jokes fetched in safe mode.',
      'An eight-second request timeout and retry.',
      'Favourites persist and update across tabs.',
    ],
  },
  {
    id: 'directory',
    title: 'Student Directory',
    category: 'React / components and props',
    description:
      'One profile component displays my details and two classmates, with data passed through props.',
    technologies: ['React', 'CSS'],
    githubUrl:
      'https://github.com/sudip09-sys/WebProgramming/tree/main/Week11%20friday/project/src',
    demoUrl: '../../Week11%20friday/index.html',
    features: [
      'A reusable StudentProfileCard component.',
      'Five props for each student.',
      'Three profiles with custom responsive CSS.',
    ],
  },
  {
    id: 'editing',
    title: 'LumaCreatives',
    category: 'Video editing / color grading',
    description:
      'My editing work focuses on pacing, colour and the way picture and sound tell a story.',
    technologies: ['Video editing'],
    demoUrl: 'https://www.instagram.com/lumacreatives_/',
    features: [
      'Video editing at LumaCreatives since 2022.',
      'Premiere Pro and DaVinci Resolve.',
      'Pacing, shot matching and colour grading.',
    ],
  },
];

export function filterProjects(items, technology) {
  return technology === 'All'
    ? items
    : items.filter((project) => project.technologies.includes(technology));
}
