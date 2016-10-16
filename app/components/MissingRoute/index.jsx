import React from 'react';

export default function MissingRoute() {
  return (
    <section className="stripe">
        <h1>Sorry we could not find that</h1>
        <p className="subtext">
          Please use top navigation to visit what you are looking for.
        </p>
        <a href="https://leanpub.com/reactspeedcoding"
          className="image__link">
          <img width="200" role="presentation"
            src="img/reactspeed-cover-leanpub.jpg" />
        </a>
    </section>
  )
}
