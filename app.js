(() => {
  const channels = Array.isArray(window.CHANNELS) ? window.CHANNELS : [];
  const list = document.getElementById('channel-list');
  const search = document.getElementById('search');
  const filters = document.getElementById('filters');
  const video = document.getElementById('video');
  const poster = document.getElementById('poster');
  const playButton = document.getElementById('play-button');
  const serverSelect = document.getElementById('server-select');
  const nowTitle = document.getElementById('now-title');
  const playingName = document.getElementById('playing-name');
  const hint = document.getElementById('player-hint');
  let category = 'All', selected = null, hls = null;
  document.getElementById('year').textContent = new Date().getFullYear();

  function stopStream() {
    if (hls) { hls.destroy(); hls = null; }
    video.pause(); video.removeAttribute('src'); video.load();
    video.classList.remove('visible'); poster.hidden = false;
  }
  function render() {
    const term = search.value.trim().toLowerCase();
    const shown = channels.filter(c => (category === 'All' || c.category === category) && c.name.toLowerCase().includes(term));
    document.getElementById('channel-count').textContent = shown.length;
    list.innerHTML = '';
    if (!shown.length) { list.innerHTML = '<div class="empty">No channels found.</div>'; return; }
    shown.forEach(c => {
      const button = document.createElement('button');
      button.className = 'channel' + (selected && selected.id === c.id ? ' selected' : '');
      button.type = 'button';
      const logo = document.createElement('span'); logo.className = 'channel-logo'; logo.textContent = c.logo || c.name.slice(0,2).toUpperCase();
      const info = document.createElement('span'); info.className = 'channel-info';
      const name = document.createElement('strong'); name.textContent = c.name;
      const sub = document.createElement('small'); sub.textContent = c.category || 'General';
      info.append(name, sub);
      const status = document.createElement('span'); status.className = 'channel-status'; status.textContent = (c.servers || []).length ? 'READY' : 'SETUP';
      button.append(logo, info, status); button.addEventListener('click', () => selectChannel(c)); list.append(button);
    });
  }
  function selectChannel(channel) {
    selected = channel; stopStream();
    nowTitle.textContent = channel.name; playingName.textContent = channel.name;
    const servers = channel.servers || [];
    serverSelect.innerHTML = '';
    servers.forEach((s, i) => { const option = document.createElement('option'); option.value = i; option.textContent = s.name || 'Server ' + (i+1); serverSelect.append(option); });
    serverSelect.disabled = servers.length < 2;
    hint.textContent = servers.length ? 'Press Click to Play to start this channel.' : 'No stream URL is configured yet. Add an authorized stream in channels.js.';
    playButton.disabled = !servers.length; playButton.style.opacity = servers.length ? '1' : '.5';
    render();
  }
  function play() {
    if (!selected || !selected.servers || !selected.servers.length) return;
    const server = selected.servers[Number(serverSelect.value)] || selected.servers[0];
    if (!server || !server.url) { hint.textContent = 'This server has no stream URL.'; return; }
    const url = server.url;
    poster.hidden = true; video.classList.add('visible');
    if ((server.type || '').toLowerCase() === 'hls' || url.toLowerCase().includes('.m3u8')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = url;
      else if (window.Hls && Hls.isSupported()) { hls = new Hls(); hls.loadSource(url); hls.attachMedia(video); }
      else { hint.textContent = 'HLS playback is not supported in this browser.'; poster.hidden = false; video.classList.remove('visible'); return; }
    } else video.src = url;
    video.play().catch(() => { hint.textContent = 'Playback did not start. Check the stream URL and press play on the video.'; });
  }
  search.addEventListener('input', render);
  filters.addEventListener('click', e => { const btn = e.target.closest('[data-category]'); if (!btn) return; category = btn.dataset.category; filters.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn)); render(); });
  playButton.addEventListener('click', play);
  serverSelect.addEventListener('change', () => { if (video.classList.contains('visible')) play(); });
  video.addEventListener('error', () => { hint.textContent = 'Stream error. The source may be offline or may block browser playback.'; });
  render();
})();