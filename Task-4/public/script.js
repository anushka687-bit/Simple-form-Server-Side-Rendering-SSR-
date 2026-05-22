document.addEventListener('DOMContentLoaded', function () {

  // ── Theme toggle ──
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.body.classList.toggle('light');
      this.textContent = document.body.classList.contains('light') ? '🌙 Dark' : '☀️ Light';
    });
  }

  // ── Progress ──
  const tracked = ['name','email','phone','password','confirmPassword','age','state','country'];
  const TOTAL   = tracked.length + 1; // +1 gender

  function updateProgress() {
    let filled = 0;
    tracked.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== '') filled++;
    });
    if (document.querySelector('input[name="gender"]:checked')) filled++;
    const pct  = Math.round((filled / TOTAL) * 100);
    const fill  = document.getElementById('progressFill');
    const label = document.getElementById('progressPct');
    if (fill)  fill.style.width  = pct + '%';
    if (label) label.textContent = pct + '% complete';
    updateSubmitBtn();
  }

  // ── Live preview ──
  function updatePreview() {
    const name    = document.getElementById('name')?.value.trim()  || '';
    const email   = document.getElementById('email')?.value.trim() || '';
    const phone   = document.getElementById('phone')?.value.trim() || '';
    const age     = document.getElementById('age')?.value.trim()   || '';
    const state   = document.getElementById('state')?.value.trim() || '';
    const country = document.getElementById('country')?.value      || '';
    const gender  = document.querySelector('input[name="gender"]:checked')?.value || '';

    const avatar = document.getElementById('previewAvatar');
    if (avatar) {
      const img = avatar.querySelector('img');
      if (!img) avatar.textContent = name ? name[0].toUpperCase() : '?';
    }

    setText('previewName',    name    || '—');
    setText('previewEmail',   email   || '—');
    setText('previewPhone',   phone   || '—');
    setText('previewAge',     age     || '—');
    setText('previewState',   state   || '—');
    setText('previewCountry', country || '—');
    setText('previewGender',  gender  || '—');

    const checked = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(c => c.value);
    const skillsWrap = document.getElementById('previewSkills');
    if (skillsWrap) {
      skillsWrap.innerHTML = checked.length
        ? checked.map(s => `<span class="preview-skill-tag">${s}</span>`).join('')
        : '<span style="color:var(--muted);font-size:0.78rem">No skills selected</span>';
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ── Name + char counter ──
  const nameInput = document.getElementById('name');
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      const counter = document.getElementById('nameCounter');
      if (counter) {
        counter.textContent = this.value.length + '/50';
        counter.className = 'char-counter' + (this.value.length > 45 ? ' warn' : '');
      }
      liveValidate('name', v => v.trim().length >= 2, 'nameErr');
      updatePreview(); updateProgress();
    });
  }

  // ── Bind live validators ──
  bindLive('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'emailErr');
  bindLive('phone', v => /^[0-9]{10}$/.test(v.trim()),                 'phoneErr');
  bindLive('age',   v => { const n=parseInt(v); return !isNaN(n)&&n>=1&&n<=120; }, 'ageErr');
  bindLive('state', v => v.trim().length >= 2,                          'stateErr');

  // ── Country ──
  document.getElementById('country')?.addEventListener('change', () => { updatePreview(); updateProgress(); });

  // ── Gender ──
  document.querySelectorAll('input[name="gender"]').forEach(r => {
    r.addEventListener('change', () => { updatePreview(); updateProgress(); });
  });

  // ── Skills ──
  document.querySelectorAll('.skill-chip input').forEach(cb => {
    cb.addEventListener('change', function () {
      this.closest('.skill-chip').classList.toggle('checked', this.checked);
      updatePreview();
    });
  });

  // ── Profile picture ──
  document.getElementById('profilePic')?.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const avatar = document.getElementById('previewAvatar');
      if (avatar) avatar.innerHTML = `<img src="${e.target.result}" alt="pic" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
    };
    reader.readAsDataURL(file);
  });

  // ── Password strength ──
  document.getElementById('password')?.addEventListener('input', function () {
    const v = this.value;
    const checks = [v.length>=8, /[A-Z]/.test(v), /[a-z]/.test(v), /\d/.test(v), /[@$!%*?&]/.test(v)];
    const score  = checks.filter(Boolean).length;
    const colors = ['#f87171','#fb923c','#facc15','#34d399','#a78bfa'];
    const labels = ['','Weak','Fair','Good','Strong','Very Strong'];
    document.querySelectorAll('.strength-seg').forEach((s, i) => {
      s.style.background = i < score ? colors[score-1] : 'var(--border)';
    });
    const lbl = document.getElementById('strengthLabel');
    if (lbl) { lbl.textContent = labels[score]; lbl.style.color = colors[score-1] || 'var(--muted)'; }
    liveValidate('password', v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v), 'passwordErr');
    checkConfirm(); updateProgress();
  });

  // ── Show/hide password ──
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.previousElementSibling;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      this.textContent = isText ? '👁' : '🙈';
    });
  });

  // ── Confirm password ──
  document.getElementById('confirmPassword')?.addEventListener('input', function () {
    checkConfirm(); updateProgress();
  });

  function checkConfirm() {
    const pw   = document.getElementById('password')?.value        || '';
    const cpw  = document.getElementById('confirmPassword')?.value || '';
    const err  = document.getElementById('confirmPasswordErr');
    const hint = document.getElementById('confirmPasswordHint');
    const inp  = document.getElementById('confirmPassword');
    if (!cpw) {
      if (err)  err.style.display  = 'none';
      if (hint) hint.style.display = 'none';
      inp?.classList.remove('valid','invalid');
      return;
    }
    const match = pw === cpw;
    if (err)  err.style.display  = match ? 'none' : 'block';
    if (hint) hint.style.display = match ? 'block' : 'none';
    inp?.classList.toggle('valid',   match);
    inp?.classList.toggle('invalid', !match);
    updateSubmitBtn();
  }

  // ── Submit button ──
  function isFormValid() {
    const name    = document.getElementById('name')?.value.trim()    || '';
    const email   = document.getElementById('email')?.value.trim()   || '';
    const phone   = document.getElementById('phone')?.value.trim()   || '';
    const pw      = document.getElementById('password')?.value       || '';
    const cpw     = document.getElementById('confirmPassword')?.value|| '';
    const age     = parseInt(document.getElementById('age')?.value   || '');
    const state   = document.getElementById('state')?.value.trim()   || '';
    const country = document.getElementById('country')?.value        || '';
    const gender  = document.querySelector('input[name="gender"]:checked');
    return (
      name.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^[0-9]{10}$/.test(phone) &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pw) &&
      pw === cpw &&
      !isNaN(age) && age >= 1 && age <= 120 &&
      state.length >= 2 &&
      country !== '' &&
      gender !== null
    );
  }

  function updateSubmitBtn() {
    const btn = document.getElementById('submitBtn');
    if (btn) btn.disabled = !isFormValid();
  }

  // ── Helpers ──
  function bindLive(id, test, errId) {
    document.getElementById(id)?.addEventListener('input', function () {
      liveValidate(id, test, errId);
      updatePreview(); updateProgress();
    });
  }

  function liveValidate(id, test, errId) {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el) return;
    const ok = test(el.value);
    el.classList.toggle('valid',   ok);
    el.classList.toggle('invalid', !ok && el.value.length > 0);
    if (err) err.style.display = (!ok && el.value.length > 0) ? 'block' : 'none';
    updateSubmitBtn();
  }

  // Init
  updateProgress();
  updatePreview();
  updateSubmitBtn();
});