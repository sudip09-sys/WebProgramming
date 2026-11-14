import React, { useState } from 'react';
import ExerciseLayout from './ExerciseLayout.jsx';

export const projects = [
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'A team-built memory game with timed challenges, hints, and two-player play.',
    technologies: ['JavaScript', 'CSS'],
    mark: '01 / PLAY',
    githubUrl: 'https://github.com/sudip09-sys/WebProgramming/tree/main/teamproject',
    demoUrl: '../teamproject/',
  },
  {
    id: 'bookfinder',
    title: 'BookFinder',
    description: 'Search books and explore results using the Open Library API.',
    technologies: ['JavaScript', 'API', 'CSS'],
    mark: '02 / DISCOVER',
    githubUrl: 'https://github.com/sudip09-sys/WebProgramming/blob/main/week7/solution.html',
    demoUrl: '../week7/solution.html',
  },
  {
    id: 'student-directory',
    title: 'Student Directory',
    description: 'Three classmate profiles rendered with the same reusable React component.',
    technologies: ['React', 'CSS'],
    mark: '03 / CONNECT',
    githubUrl: 'https://github.com/sudip09-sys/WebProgramming/tree/main/Week11%20friday/project',
    demoUrl: './index.html',
  },
];

export function ProjectCard({ title, description, technologies, githubUrl, demoUrl, mark }) {
  return (
    <article className="catalog-card gallery-card">
      <div className="project-visual" aria-hidden="true">
        <span>{mark}</span>
        <b>{title === 'Memory Match' ? 'MM' : title === 'BookFinder' ? 'BF' : '< />'}</b>
      </div>
      <div className="gallery-body">
        <h2>{title}</h2>
        <p>{description}</p>
        <ul className="tech-tags" aria-label={`${title} technologies`}>
          {technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-links">
          <a href={githubUrl}>
            GitHub source <span aria-hidden="true">&#8599;</span>
          </a>
          <a href={demoUrl}>
            Live demo <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProjectList({ projects }) {
  if (projects.length === 0)
    return <p className="empty-gallery">No projects match this technology.</p>;
  return (
    <section className="catalog-grid" aria-label="Portfolio projects">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </section>
  );
}

export function FilterBar({ technologies, selected, onSelect }) {
  return (
    <div className="gallery-filters" role="group" aria-label="Filter projects by technology">
      {technologies.map((tech) => (
        <button
          key={tech}
          type="button"
          aria-pressed={selected === tech}
          onClick={() => onSelect(tech)}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [selected, setSelected] = useState('All');
  const technologies = ['All', ...new Set(projects.flatMap((project) => project.technologies))];
  const visible =
    selected === 'All'
      ? projects
      : projects.filter((project) => project.technologies.includes(selected));
  return (
    <ExerciseLayout
      title="PROJECT GALLERY"
      description="Things I have built. Filter by technology, inspect the code, or open a working demo."
    >
      <div className="gallery-toolbar">
        <FilterBar technologies={technologies} selected={selected} onSelect={setSelected} />
        <p role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        </p>
      </div>
      <ProjectList projects={visible} />
      <p className="data-note">
        Three existing projects from my coursework. ProjectCard handles each card, ProjectList
        renders the array, and FilterBar selects which projects appear.
      </p>
    </ExerciseLayout>
  );
}
