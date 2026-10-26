/* ═══ OSMO CSS MARQUEE JS — VERBATIM ═══════════════════════════════════════
   Shared by SHELL-marquee-v2.html and marquee-reference.html.
   Duplicates the list, derives the duration from its width so speed stays
   constant whatever the copy says, and pauses when out of view.

   NOTE for this repo: the IntersectionObserver root is the IFRAME's own
   viewport, so inside a Fastr embed the list is effectively always
   intersecting and the pause-when-offscreen behaviour is inert. Harmless,
   kept verbatim, but do not expect it to save anything.
   Touches nothing outside the iframe (rule B2).                            */
function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');

  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list =>
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });

  // Calculate the width and set the animation duration accordingly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}
/* ═══ END OSMO JS ═════════════════════════════════════════════════════════ */

/* ADDED (canon, not Osmo): never start the engine under reduced motion.
   No duplicate list is created and nothing animates. The CSS in
   marquee-canon.css covers the same case for the CSS-only path. */
document.addEventListener('DOMContentLoaded', function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  initCSSMarquee();
});
