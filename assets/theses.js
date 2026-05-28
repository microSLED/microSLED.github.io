async function loadTheses() {
  const container = document.querySelector('[data-theses-list]');
  if (!container) return;

  try {
    const response = await fetch('data/theses.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load thesis data');
    const theses = await response.json();

    container.innerHTML = theses.map((thesis) => {
      const tags = (thesis.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
      const contact = thesis.contact || 'mario.casu@polito.it';
      const details = thesis.detailsUrl
        ? `<a class="button" href="${escapeAttribute(thesis.detailsUrl)}">More details</a>`
        : '';
      return `
        <article class="proposal" id="${escapeHtml(thesis.id || '')}">
          <span class="status">${escapeHtml(thesis.status || 'Open')}</span>
          <h3>${escapeHtml(thesis.title || 'Untitled thesis proposal')}</h3>
          <p>${escapeHtml(thesis.summary || '')}</p>
          <div class="tagrow">${tags}</div>
          <div class="meta">
            <div><strong>Prerequisites</strong><span>${escapeHtml(thesis.prerequisites || 'To be defined with the supervisor.')}</span></div>
            <div><strong>Expected outcomes</strong><span>${escapeHtml(thesis.outcomes || 'To be defined with the supervisor.')}</span></div>
            <div><strong>Supervisor</strong><span>${escapeHtml(thesis.supervisor || 'microSLED')}</span></div>
            <div><strong>Contact</strong><span><a href="mailto:${escapeAttribute(contact)}?subject=${encodeURIComponent('Master thesis proposal: ' + (thesis.title || 'microSLED'))}">${escapeHtml(contact)}</a></span></div>
          </div>
          ${details}
        </article>`;
    }).join('');
  } catch (error) {
    container.innerHTML = `<article class="proposal"><h3>Thesis proposals temporarily unavailable</h3><p>Please contact <a href="mailto:mario.casu@polito.it">mario.casu@polito.it</a>.</p></article>`;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

loadTheses();
