// initialize Markdown-it
const md = window.markdownit({ html: true });

// cache DOM nodes
const catalog     = document.getElementById('catalog');
const bookViewer  = document.getElementById('book-viewer');
const courseTiles = document.querySelectorAll('.course-tile');
const courseList  = document.getElementById('course-list');
const backButton  = document.getElementById('back-button');

/** Load a markdown file into #content and build its TOC */
function loadNote(path) {
  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.text();
    })
    .then(text => {
      // render markdown
      document.getElementById('content').innerHTML = md.render(text);
      buildTOC();
    })
    .catch(err => {
      document.getElementById('content').innerHTML =
        `<p style="color:red;">Error loading note: ${err.message}</p>`;
      console.error(err);
    });
}

/** Scan headings in #content and populate #toc */
function buildTOC() {
  const container = document.getElementById('content');
  const tocNav    = document.getElementById('toc');
  const headings  = container.querySelectorAll('h1, h2, h3');
  let html = '<ul>';
  headings.forEach(h => {
    const level = +h.tagName.charAt(1);            // 1, 2, or 3
    const text  = h.textContent;
    const id    = h.id || text.toLowerCase().replace(/\s+/g, '-');
    h.id = id;
    html += `<li class="level-${level}"><a href="#${id}">${text}</a></li>`;
  });
  tocNav.innerHTML = html + '</ul>';
}

/** Show the book-viewer, hide catalog, and load the file */
function showBook(file) {
  catalog.style.display    = 'none';
  bookViewer.style.display = 'flex';
  loadNote(file);
}

/** Tile click → open that book */
courseTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    showBook(tile.dataset.file);
  });
});

/** Directory list click → open that book */
courseList.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    showBook(e.target.dataset.file);
  }
});

/** Back button → return to catalog */
backButton.addEventListener('click', () => {
  bookViewer.style.display = 'none';
  catalog.style.display    = 'block';
});

// (Optional) initial state: leave catalog up, do not auto-load any note
