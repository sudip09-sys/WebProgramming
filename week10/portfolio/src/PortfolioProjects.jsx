import React, { useEffect, useRef, useState } from 'react';
import ProjectArtwork from './ProjectArtwork.jsx';
import { projects, filterProjects } from './projects.mjs';

export function FilterBar({ technologies, selected, onSelect }) {
  return (
    <div className="filters" role="group" aria-label="Filter projects by technology">
      {technologies.map((technology) => (
        <button
          key={technology}
          type="button"
          aria-controls="project-deck"
          aria-pressed={selected === technology}
          onClick={() => onSelect(technology)}
        >
          {technology}
        </button>
      ))}
    </div>
  );
}

export function ProjectCard({ project, active = true, slot = 0, onSelect, onDetails }) {
  function tilt(event) {
    if (
      !active ||
      document.documentElement.dataset.motion === 'off' ||
      !matchMedia('(pointer:fine)').matches
    )
      return;
    const card = event.currentTarget,
      rect = card.getBoundingClientRect();
    card.style.setProperty(
      '--tilt-x',
      `${(-(event.clientY - rect.top - rect.height / 2) / rect.height) * 3}deg`,
    );
    card.style.setProperty(
      '--tilt-y',
      `${((event.clientX - rect.left - rect.width / 2) / rect.width) * 3}deg`,
    );
  }
  function clearTilt(event) {
    event.currentTarget.style.removeProperty('--tilt-x');
    event.currentTarget.style.removeProperty('--tilt-y');
  }
  return (
    <article
      className="project-card"
      data-project={project.id}
      data-slot={slot}
      aria-hidden={!active}
      onPointerMove={tilt}
      onPointerLeave={clearTilt}
      onClickCapture={(event) => {
        if (!active) {
          event.preventDefault();
          event.stopPropagation();
          onSelect?.();
        }
      }}
    >
      <ProjectArtwork kind={project.id} />
      <div className="project-copy">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.id === 'directory' ? 'COMPONENTS' : 'SELECTED WORK'}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-technologies" aria-label={`${project.title} technologies`}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-links">
          <a href={project.demoUrl} tabIndex={active ? undefined : -1}>
            {project.id === 'editing' ? 'Editing profile' : 'Live project'}{' '}
            <span aria-hidden="true">↗</span>
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              tabIndex={active ? undefined : -1}
              aria-label={`${project.title} GitHub source`}
            >
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
          <button
            type="button"
            tabIndex={active ? undefined : -1}
            onClick={(event) => onDetails?.(project, event.currentTarget)}
          >
            Details <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProjectList({ projects, current = 0, onSelect, onDetails, deckRef }) {
  if (!projects.length)
    return (
      <p className="empty-projects" role="status">
        No projects use this technology yet.
      </p>
    );
  return (
    <div
      className="project-deck"
      id="project-deck"
      ref={deckRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
    >
      {projects.map((project, index) => {
        let slot = (index - current + projects.length) % projects.length;
        if (slot === projects.length - 1 && slot !== 0) slot = -1;
        return (
          <ProjectCard
            key={project.id}
            project={project}
            active={index === current}
            slot={slot > 1 ? 2 : slot}
            onSelect={() => onSelect(index)}
            onDetails={onDetails}
          />
        );
      })}
    </div>
  );
}

function ProjectDetails({ project, triggerRef, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (project && !dialog.current.open) dialog.current.showModal();
  }, [project]);
  return (
    <dialog
      id="project-dialog"
      ref={dialog}
      aria-labelledby="dialog-title"
      onClose={() => {
        onClose();
        triggerRef.current?.focus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current.close();
      }}
    >
      <div className="dialog-heading">
        <p className="eyebrow">BEHIND THE BUILD</p>
        <button type="button" autoFocus onClick={() => dialog.current.close()}>
          Close ×
        </button>
      </div>
      <p className="eyebrow">{project?.category}</p>
      <h2 id="dialog-title">{project?.title || 'Project details'}</h2>
      <p>{project?.description}</p>
      <h3>What I worked on</h3>
      <ul>
        {project?.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <div className="actions">
        {project && (
          <a className="button primary" href={project.demoUrl}>
            Open project ↗
          </a>
        )}
        {project?.githubUrl && (
          <a className="text-link" href={project.githubUrl}>
            View source ↗
          </a>
        )}
      </div>
    </dialog>
  );
}

export default function PortfolioProjects() {
  const [technology, setTechnology] = useState('All');
  const [current, setCurrent] = useState(0);
  const [details, setDetails] = useState(null);
  const deckRef = useRef(null),
    triggerRef = useRef(null),
    swipe = useRef(null);
  const technologies = ['All', ...new Set(projects.flatMap((project) => project.technologies))];
  const visible = filterProjects(projects, technology);
  function choose(index) {
    if (!visible.length) return;
    if (deckRef.current?.contains(document.activeElement))
      deckRef.current.focus({ preventScroll: true });
    setCurrent((index + visible.length) % visible.length);
  }
  return (
    <div className="portfolio-projects" data-ready="true">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-number">01</span> THE THINGS I MAKE
          </p>
          <h2 id="work-title">
            SELECTED WORK<span className="red">.</span>
          </h2>
          <p>Projects I can open, explain and keep improving.</p>
        </div>
        <FilterBar
          technologies={technologies}
          selected={technology}
          onSelect={(value) => {
            setTechnology(value);
            setCurrent(0);
          }}
        />
      </div>
      <div
        className="project-stage"
        aria-label="Project showcase"
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            choose(current + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch') swipe.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
        onPointerUp={(event) => {
          if (!swipe.current) return;
          const dx = event.clientX - swipe.current.x,
            dy = event.clientY - swipe.current.y;
          swipe.current = null;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5)
            choose(current + (dx < 0 ? 1 : -1));
        }}
      >
        <ProjectList
          projects={visible}
          current={current}
          deckRef={deckRef}
          onSelect={choose}
          onDetails={(project, trigger) => {
            triggerRef.current = trigger;
            setDetails(project);
          }}
        />
        <div className="deck-controls">
          <button
            type="button"
            aria-label="Previous project"
            disabled={visible.length < 2}
            onClick={() => choose(current - 1)}
          >
            ←
          </button>
          <p id="project-position" role="status" aria-live="polite">
            {String(current + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}
          </p>
          <button
            type="button"
            aria-label="Next project"
            disabled={visible.length < 2}
            onClick={() => choose(current + 1)}
          >
            →
          </button>
        </div>
      </div>
      <div className="project-index" role="group" aria-label="Choose a project">
        {visible.map((project, index) => (
          <button
            key={project.id}
            type="button"
            aria-controls="project-deck"
            aria-pressed={index === current}
            onClick={() => choose(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {project.title}
          </button>
        ))}
      </div>
      <p className="project-results" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'project' : 'projects'} ·{' '}
        {technology === 'All' ? 'All work' : technology}
      </p>
      <ProjectDetails project={details} triggerRef={triggerRef} onClose={() => setDetails(null)} />
    </div>
  );
}
