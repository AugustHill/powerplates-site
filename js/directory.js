// Renders and filters the member directory on directory.html from
// js/directory-data.js. Only runs if that page's markup is present.

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.querySelector('#directory-grid');
  if (!grid || typeof POWERPLATES_DIRECTORY === 'undefined') return;

  var emptyState = document.querySelector('#directory-empty');
  var searchInput = document.querySelector('#directory-search');
  var industryFilter = document.querySelector('#directory-industry-filter');
  var marketFilter = document.querySelector('#directory-market-filter');

  // Populate the industry dropdown from whatever industries actually
  // appear in the data, so it never lists an empty category.
  var industries = Array.from(
    new Set(POWERPLATES_DIRECTORY.map(function (m) { return m.industry; }))
  ).sort();
  industries.forEach(function (industry) {
    var opt = document.createElement('option');
    opt.value = industry;
    opt.textContent = industry;
    industryFilter.appendChild(opt);
  });

  function initials(name) {
    return name.split(/\s+/).map(function (part) { return part.charAt(0); }).join('').slice(0, 2).toUpperCase();
  }

  function cardHtml(m) {
    var photoInner = m.photo
      ? '<img src="' + m.photo + '" alt="' + m.name + '">'
      : initials(m.name);

    var contactBits = [];
    if (m.link) contactBits.push('<a href="' + m.link + '" target="_blank" rel="noopener">Website</a>');
    if (m.email) contactBits.push('<a href="mailto:' + m.email + '">' + m.email + '</a>');
    if (m.phone) contactBits.push('<span>' + m.phone + '</span>');

    return '' +
      '<div class="card directory-card">' +
        '<div class="plate-photo"><div class="plate-photo-inner">' + photoInner + '</div></div>' +
        '<span class="tag">' + m.industry + '</span>' +
        '<h3>' + m.name + '</h3>' +
        '<p><strong>' + m.occupation + '</strong><br>' + m.company + '</p>' +
        (m.bio ? '<p>' + m.bio + '</p>' : '') +
        '<p class="directory-market">' + m.market + '</p>' +
        (contactBits.length ? '<div class="directory-contact">' + contactBits.join(' &middot; ') + '</div>' : '') +
      '</div>';
  }

  function render() {
    var q = (searchInput.value || '').trim().toLowerCase();
    var industry = industryFilter.value;
    var market = marketFilter.value;

    var filtered = POWERPLATES_DIRECTORY.filter(function (m) {
      var haystack = [m.name, m.company, m.occupation, m.bio || ''].join(' ').toLowerCase();
      var matchesQuery = !q || haystack.indexOf(q) !== -1;
      var matchesIndustry = !industry || m.industry === industry;
      var matchesMarket = !market || m.market === market;
      return matchesQuery && matchesIndustry && matchesMarket;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = filtered.map(cardHtml).join('');
    }
  }

  searchInput.addEventListener('input', render);
  industryFilter.addEventListener('change', render);
  marketFilter.addEventListener('change', render);
  render();
});
