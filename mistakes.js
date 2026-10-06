const data = [
  { brand: 'Rivian',     country: 'USA',     satisfaction: 86, reliability: 14 },
  { brand: 'BMW',        country: 'Germany',  satisfaction: 73, reliability: 53 },
  { brand: 'Tesla',      country: 'USA',     satisfaction: 72, reliability: 36 },
  { brand: 'Lexus',      country: 'Japan',   satisfaction: 70, reliability: 65 },
  { brand: 'Chevrolet',  country: 'USA',     satisfaction: 70, reliability: 37 },
  { brand: 'Subaru',     country: 'Japan',   satisfaction: 68, reliability: 68 },
  { brand: 'Genesis',    country: 'S. Korea', satisfaction: 68, reliability: 40 },
  { brand: 'Ford',       country: 'USA',     satisfaction: 67, reliability: 44 },
  { brand: 'GMC',        country: 'USA',     satisfaction: 67, reliability: 33 },
  { brand: 'Hyundai',    country: 'S. Korea', satisfaction: 67, reliability: 50 },
  { brand: 'Toyota',     country: 'Japan',   satisfaction: 67, reliability: 62 },
  { brand: 'Honda',      country: 'Japan',   satisfaction: 66, reliability: 59 },
  { brand: 'Cadillac',   country: 'USA',     satisfaction: 65, reliability: 27 },
  { brand: 'Kia',        country: 'S. Korea', satisfaction: 64, reliability: 51 },
  { brand: 'Volvo',      country: 'Sweden',  satisfaction: 63, reliability: 38 },
  { brand: 'Mazda',      country: 'Japan',   satisfaction: 61, reliability: 55 },
  { brand: 'Acura',      country: 'Japan',   satisfaction: 61, reliability: 55 },
  { brand: 'Audi',       country: 'Germany', satisfaction: 60, reliability: 54 },
  { brand: 'Buick',      country: 'USA',     satisfaction: 59, reliability: 48 },
  { brand: 'Nissan',     country: 'Japan',   satisfaction: 54, reliability: 48 },
  { brand: 'Volkswagen', country: 'Germany', satisfaction: 54, reliability: 34 },
  { brand: 'Jeep',       country: 'USA',     satisfaction: 51, reliability: 33 },
];

const COLORS = {
  'Japan':    '#E05555',
  'USA':      '#4A7FC1',
  'S. Korea': '#6B57D2',
  'Germany':  '#2D9D78',
  'Sweden':   '#E8AE00',
};

const COUNTRY_RU = {
  'Japan': 'Япония',
  'USA': 'США',
  'S. Korea': 'Ю. Корея',
  'Germany': 'Германия',
  'Sweden': 'Швеция',
};

let hoverTip = null;
function ensureTooltip() {
  if (hoverTip) return hoverTip;
  hoverTip = document.createElement('div');
  hoverTip.className = 'd3-tooltip';
  hoverTip.style.opacity = '0';
  document.body.appendChild(hoverTip);
  return hoverTip;
}
function showTip(evt, html) {
  const tip = ensureTooltip();
  tip.innerHTML = html;
  tip.style.opacity = '1';
  const x = Math.min(evt.clientX + 14, window.innerWidth - 280);
  const y = Math.max(evt.clientY - 10, 10);
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}
function hideTip() { ensureTooltip().style.opacity = '0'; }

document.addEventListener('DOMContentLoaded', function () {

/* ---- Legend ---- */
const legendEl = document.getElementById('legend');
Object.entries(COLORS).forEach(([country, color]) => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.innerHTML = `<div class="legend-dot" style="background:${color}"></div>${COUNTRY_RU[country]}`;
  legendEl.appendChild(item);
});

/* ---- Scatter plot ---- */
(function drawScatter() {
  const el = document.getElementById('scatter');
  const svg = d3.select(el);

  const margin = { top: 24, right: 30, bottom: 50, left: 56 };
  const W = 960;
  const H = 520;
  svg.attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');

  const xMin = 10, xMax = 90, yMin = 10, yMax = 90;
  const x = d3.scaleLinear().domain([xMin, xMax]).range([margin.left, W - margin.right]);
  const y = d3.scaleLinear().domain([yMin, yMax]).range([H - margin.bottom, margin.top]);

  svg.append('line')
    .attr('x1', x(xMin)).attr('y1', y(xMin))
    .attr('x2', x(xMax)).attr('y2', y(xMax))
    .attr('stroke', '#e5e7eb').attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6,4');

  svg.append('text')
    .attr('x', x(82)).attr('y', y(85))
    .attr('font-size', '10px').attr('fill', '#bbb').attr('font-style', 'italic')
    .text('satisfaction = reliability');

  const quadrants = [
    { label: 'Надёжные и любимые', x: xMax - 2, y: yMax - 2, anchor: 'end', baseline: 'hanging' },
    { label: 'Надёжные, но не впечатляют', x: xMin + 2, y: yMax - 2, anchor: 'start', baseline: 'hanging' },
    { label: 'Любимые, но ненадёжные', x: xMax - 2, y: yMin + 2, anchor: 'end', baseline: 'auto' },
    { label: 'Ни то, ни другое', x: xMin + 2, y: yMin + 2, anchor: 'start', baseline: 'auto' },
  ];
  const medSat = d3.median(data, d => d.satisfaction);
  const medRel = d3.median(data, d => d.reliability);

  svg.append('line')
    .attr('x1', x(medSat)).attr('y1', y(yMin)).attr('x2', x(medSat)).attr('y2', y(yMax))
    .attr('stroke', '#f0f0f0').attr('stroke-width', 1);
  svg.append('line')
    .attr('x1', x(xMin)).attr('y1', y(medRel)).attr('x2', x(xMax)).attr('y2', y(medRel))
    .attr('stroke', '#f0f0f0').attr('stroke-width', 1);

  quadrants.forEach(q => {
    svg.append('text')
      .attr('x', x(q.x)).attr('y', y(q.y))
      .attr('text-anchor', q.anchor)
      .attr('dominant-baseline', q.baseline)
      .attr('font-size', '11px').attr('fill', '#d1d5db').attr('font-weight', '600')
      .text(q.label);
  });

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6).tickSize(-(W - margin.left - margin.right)).tickFormat(''))
    .selectAll('line').attr('stroke', '#f5f5f5');
  svg.selectAll('.domain').remove();

  svg.append('g')
    .attr('transform', `translate(0,${H - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(8));
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6));

  svg.selectAll('.domain').attr('stroke', '#ddd');
  svg.selectAll('.tick text').style('font-size', '11px').style('fill', '#888');
  svg.selectAll('.tick line').attr('stroke', '#eee');

  svg.append('text')
    .attr('x', W / 2).attr('y', H - 6)
    .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#888').attr('font-weight', '600')
    .text('Satisfaction (% готовых купить снова)');
  svg.append('text')
    .attr('transform', `rotate(-90)`)
    .attr('x', -H / 2).attr('y', 14)
    .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#888').attr('font-weight', '600')
    .text('Reliability Score');

  const dots = svg.selectAll('.dot').data(data).enter().append('g');

  dots.append('circle')
    .attr('cx', d => x(d.satisfaction))
    .attr('cy', d => y(d.reliability))
    .attr('r', 7)
    .attr('fill', d => COLORS[d.country])
    .attr('opacity', 0.85)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .style('cursor', 'pointer')
    .on('mouseenter', function (evt, d) {
      d3.select(this).attr('r', 9).attr('opacity', 1);
      const satRank = [...data].sort((a, b) => b.satisfaction - a.satisfaction).findIndex(i => i.brand === d.brand) + 1;
      const relRank = [...data].sort((a, b) => b.reliability - a.reliability).findIndex(i => i.brand === d.brand) + 1;
      showTip(evt,
        `<div class="tt-title">${d.brand}</div>` +
        `<div class="tt-row"><span class="tt-label">Страна</span><span class="tt-val">${COUNTRY_RU[d.country]}</span></div>` +
        `<div class="tt-row"><span class="tt-label">Satisfaction</span><span class="tt-val">${d.satisfaction}% (#${satRank})</span></div>` +
        `<div class="tt-row"><span class="tt-label">Reliability</span><span class="tt-val">${d.reliability} (#${relRank})</span></div>` +
        `<div class="tt-row"><span class="tt-label">Разница рангов</span><span class="tt-val">${relRank - satRank > 0 ? '+' : ''}${relRank - satRank}</span></div>`
      );
    })
    .on('mousemove', function (evt) { showTip(evt, ensureTooltip().innerHTML); })
    .on('mouseleave', function () { d3.select(this).attr('r', 7).attr('opacity', 0.85); hideTip(); });

  const labelOffsets = {
    'Rivian': [12, -12], 'Tesla': [12, -10], 'BMW': [12, 5],
    'Subaru': [12, -12], 'Lexus': [-12, -12], 'Toyota': [12, 5],
    'Honda': [12, -12], 'Cadillac': [12, 5], 'Chevrolet': [12, 10],
    'Genesis': [12, 5], 'Volvo': [12, 5], 'Volkswagen': [12, -10],
    'Jeep': [-12, 10], 'GMC': [-12, -5], 'Nissan': [-12, 5],
    'Buick': [12, -10], 'Kia': [12, 10], 'Hyundai': [-12, -10],
    'Ford': [-12, 5], 'Mazda': [-12, -5], 'Acura': [12, 10],
    'Audi': [-12, 10],
  };

  dots.append('text')
    .attr('x', d => x(d.satisfaction) + (labelOffsets[d.brand]?.[0] || 12))
    .attr('y', d => y(d.reliability) + (labelOffsets[d.brand]?.[1] || 0))
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .attr('fill', d => COLORS[d.country])
    .attr('text-anchor', d => (labelOffsets[d.brand]?.[0] || 12) < 0 ? 'end' : 'start')
    .attr('dominant-baseline', 'middle')
    .text(d => d.brand)
    .style('pointer-events', 'none');
})();

/* ---- Diverging bar chart (rank difference) ---- */
(function drawDiverging() {
  const sorted = [...data].sort((a, b) => b.satisfaction - a.satisfaction);
  sorted.forEach((d, i) => { d.satRank = i + 1; });
  const relSorted = [...data].sort((a, b) => b.reliability - a.reliability);
  relSorted.forEach((d, i) => { d.relRank = i + 1; });
  const byBrand = {};
  sorted.forEach(d => { byBrand[d.brand] = d; });
  relSorted.forEach(d => { byBrand[d.brand].relRank = d.relRank; });

  const items = sorted.map(d => ({
    ...d,
    diff: d.satRank - d.relRank,
  }));
  items.sort((a, b) => b.diff - a.diff);

  const el = document.getElementById('diverging');
  const svg = d3.select(el);

  const margin = { top: 8, right: 50, bottom: 30, left: 100 };
  const barH = 22, gap = 4;
  const H = margin.top + items.length * (barH + gap) + margin.bottom;
  const W = 960;
  svg.attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');

  const maxAbs = d3.max(items, d => Math.abs(d.diff));
  const xScale = d3.scaleLinear().domain([-maxAbs - 1, maxAbs + 1]).range([margin.left, W - margin.right]);

  svg.append('line')
    .attr('x1', xScale(0)).attr('y1', margin.top)
    .attr('x2', xScale(0)).attr('y2', H - margin.bottom)
    .attr('stroke', '#ccc').attr('stroke-width', 1);

  svg.append('g')
    .attr('transform', `translate(0,${H - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(Math.min(maxAbs * 2, 20)).tickFormat(d => {
      if (d > 0) return '+' + d;
      return d;
    }));
  svg.selectAll('.domain').attr('stroke', '#ddd');
  svg.selectAll('.tick text').style('font-size', '10px').style('fill', '#888');
  svg.selectAll('.tick line').attr('stroke', '#eee');

  svg.append('text')
    .attr('x', xScale(-maxAbs)).attr('y', H - 4)
    .attr('font-size', '10px').attr('fill', '#888').attr('text-anchor', 'start')
    .text('Надёжнее, чем кажется');
  svg.append('text')
    .attr('x', xScale(maxAbs)).attr('y', H - 4)
    .attr('font-size', '10px').attr('fill', '#888').attr('text-anchor', 'end')
    .text('Нравится больше, чем надёжен');

  items.forEach((d, i) => {
    const yPos = margin.top + i * (barH + gap);
    const barStart = xScale(0);
    const barEnd = xScale(d.diff);
    const barW = Math.abs(barEnd - barStart);
    const barX = d.diff >= 0 ? barStart : barEnd;

    svg.append('rect')
      .attr('x', barX).attr('y', yPos)
      .attr('width', barW || 1).attr('height', barH)
      .attr('rx', 4)
      .attr('fill', d.diff >= 0 ? '#4A7FC1' : '#E05555')
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseenter', function (evt) {
        d3.select(this).attr('opacity', 1);
        showTip(evt,
          `<div class="tt-title">${d.brand}</div>` +
          `<div class="tt-row"><span class="tt-label">Ранг Satisfaction</span><span class="tt-val">#${d.satRank}</span></div>` +
          `<div class="tt-row"><span class="tt-label">Ранг Reliability</span><span class="tt-val">#${d.relRank}</span></div>` +
          `<div class="tt-row"><span class="tt-label">Разница</span><span class="tt-val">${d.diff > 0 ? '+' : ''}${d.diff}</span></div>`
        );
      })
      .on('mousemove', function (evt) { showTip(evt, ensureTooltip().innerHTML); })
      .on('mouseleave', function () { d3.select(this).attr('opacity', 0.7); hideTip(); });

    svg.append('text')
      .attr('x', margin.left - 6).attr('y', yPos + barH / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('font-size', '12px').attr('font-weight', '600')
      .attr('fill', COLORS[d.country])
      .text(d.brand);

    const valX = d.diff >= 0 ? barEnd + 6 : barEnd - 6;
    const valAnchor = d.diff >= 0 ? 'start' : 'end';
    svg.append('text')
      .attr('x', valX).attr('y', yPos + barH / 2)
      .attr('text-anchor', valAnchor).attr('dominant-baseline', 'middle')
      .attr('font-size', '11px').attr('font-weight', '700')
      .attr('fill', d.diff >= 0 ? '#4A7FC1' : '#E05555')
      .text((d.diff > 0 ? '+' : '') + d.diff);
  });
})();

}); // end DOMContentLoaded
