import React from 'react';

export default function ProjectArtwork({ kind }) {
  if (kind === 'memory')
    return (
      <div className="project-poster memory-poster" aria-hidden="true">
        <div className="poster-topline">
          MEMORY MATCH <span>01 / INTERACTIVE</span>
        </div>
        <div className="memory-tiles">
          <span>?</span>
          <span className="flipped">✦</span>
          <span>?</span>
          <span>?</span>
          <span>?</span>
          <span>?</span>
          <span className="flipped">✦</span>
          <span>?</span>
        </div>
        <div className="poster-bottomline">
          A LITTLE FOCUS GOES A LONG WAY. <span>↗</span>
        </div>
      </div>
    );
  if (kind === 'books')
    return (
      <div className="project-poster book-poster" aria-hidden="true">
        <div className="poster-topline">
          BOOK SEARCH <span>02 / DISCOVER</span>
        </div>
        <div className="book-scene">
          <span className="book book-one">
            ONE
            <br />
            MORE
            <br />
            CHAPTER.
          </span>
          <span className="book book-two">
            THE ART
            <br />
            OF
            <br />
            GETTING
            <br />
            LOST.
          </span>
          <span className="book book-three">
            FIND
            <br />
            YOUR
            <br />
            NEXT.
          </span>
        </div>
        <div className="book-searchbar">
          <span>⌕</span> Search by title or author <span>↗</span>
        </div>
      </div>
    );
  if (kind === 'jokes')
    return (
      <div className="project-poster joke-poster" aria-hidden="true">
        <div className="poster-topline">
          JOKELAB <span>03 / JUST FOR FUN</span>
        </div>
        <div className="joke-art">
          <span className="joke-smile">:)</span>
          <span>
            GOOD CODE.
            <br />
            QUESTIONABLE
            <br />
            <em>PUNCHLINES.</em>
          </span>
        </div>
        <div className="poster-bottomline">
          FETCH A LAUGH. KEEP A FAVOURITE. <span>↗</span>
        </div>
      </div>
    );
  if (kind === 'editing')
    return (
      <div className="project-poster editing-poster" aria-hidden="true">
        <div className="poster-topline">
          LUMACREATIVES <span>04 / IN THE EDIT</span>
        </div>
        <div className="film-scene">
          <span className="film-frame frame-before">THE RAW.</span>
          <span className="film-frame frame-after">THE FEELING.</span>
        </div>
        <div className="edit-timeline">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <b></b>
        </div>
        <div className="poster-bottomline">
          PACING. COLOR. STORY. <span>↗</span>
        </div>
      </div>
    );
  return (
    <div className="project-poster directory-poster" aria-hidden="true">
      <div className="poster-topline">
        STUDENT DIRECTORY <span>COMPONENTS / PROPS</span>
      </div>
      <div className="directory-avatars">
        <span>S</span>
        <span>A</span>
        <span>E</span>
      </div>
      <div className="poster-bottomline">
        ONE COMPONENT. THREE PROFILES. <span>↗</span>
      </div>
    </div>
  );
}
