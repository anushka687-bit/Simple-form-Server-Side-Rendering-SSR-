document.addEventListener('DOMContentLoaded', function () {

  // ── Theme toggle ──
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      this.textContent = document.body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
    });
  }

  // ── Progress tracking ──
  const tracked = [
    'firstName','surname','age',
    'collegeName','course','branch','startYear','endYear','cgpa',
    'email','phone','city','pincode','state','country'
  ];
  const TOTAL = tracked.length + 1; // +1 gender

  function updateProgress() {
    let filled = 0;
    tracked.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== '') filled++;
    });
    if (document.querySelector('input[name="gender"]:checked')) filled++;
    const pct   = Math.round((filled / TOTAL) * 100);
    const fill  = document.getElementById('progressFill');
    const label = document.getElementById('progressPct');
    if (fill)  fill.style.width  = pct + '%';
    if (label) label.textContent = pct + '% complete';
    updateSubmitBtn();
  }

  // ── Live validators ──
  bindLive('firstName', v => v.trim().length >= 1,                              'firstNameErr');
  bindLive('surname',   v => v.trim().length >= 1,                              'surnameErr');
  bindLive('age',       v => { const n=parseInt(v); return !isNaN(n)&&n>=1&&n<=100; }, 'ageErr');
  bindLive('collegeName', v => v.trim().length >= 1,                            'collegeNameErr');
  bindLive('cgpa',      v => { const n=parseFloat(v); return !isNaN(n)&&n>=0&&n<=10; }, 'cgpaErr');
  bindLive('email',     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),      'emailErr');
  bindLive('phone',     v => /^[0-9]{10}$/.test(v.trim()),                     'phoneErr');
  bindLive('city',      v => v.trim().length >= 1,                              'cityErr');
  bindLive('pincode',   v => /^[0-9]{6}$/.test(v.trim()),                      'pincodeErr');
  bindLive('state',     v => v.trim().length >= 1,                              'stateErr');

  // Select dropdowns
  ['course','branch','startYear','endYear','country'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', function () {
      const err = document.getElementById(id + 'Err');
      if (err) err.style.display = this.value ? 'none' : 'block';
      updateProgress();
    });
  });

  // Gender
  document.querySelectorAll('input[name="gender"]').forEach(r => {
    r.addEventListener('change', () => {
      const err = document.getElementById('genderErr');
      if (err) err.style.display = 'none';
      updateProgress();
    });
  });

  // ── Form validity ──
  function isFormValid() {
    const firstName  = document.getElementById('firstName')?.value.trim()  || '';
    const surname    = document.getElementById('surname')?.value.trim()    || '';
    const age        = parseInt(document.getElementById('age')?.value      || '');
    const gender     = document.querySelector('input[name="gender"]:checked');
    const collegeName= document.getElementById('collegeName')?.value.trim()|| '';
    const course     = document.getElementById('course')?.value            || '';
    const branch     = document.getElementById('branch')?.value            || '';
    const startYear  = document.getElementById('startYear')?.value         || '';
    const endYear    = document.getElementById('endYear')?.value           || '';
    const cgpa       = parseFloat(document.getElementById('cgpa')?.value   || '');
    const email      = document.getElementById('email')?.value.trim()      || '';
    const phone      = document.getElementById('phone')?.value.trim()      || '';
    const city       = document.getElementById('city')?.value.trim()       || '';
    const pincode    = document.getElementById('pincode')?.value.trim()    || '';
    const state      = document.getElementById('state')?.value.trim()      || '';
    const country    = document.getElementById('country')?.value           || '';

    return (
      firstName.length >= 1 &&
      surname.length >= 1 &&
      !isNaN(age) && age >= 1 && age <= 100 &&
      gender !== null &&
      collegeName.length >= 1 &&
      course !== '' &&
      branch !== '' &&
      startYear !== '' &&
      endYear !== '' &&
      parseInt(endYear) >= parseInt(startYear) &&
      !isNaN(cgpa) && cgpa >= 0 && cgpa <= 10 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^[0-9]{10}$/.test(phone) &&
      city.length >= 1 &&
      /^[0-9]{6}$/.test(pincode) &&
      state.length >= 1 &&
      country !== ''
    );
  }

  function updateSubmitBtn() {
    const btn = document.getElementById('submitBtn');
    if (btn) btn.disabled = !isFormValid();
  }

  function bindLive(id, test, errId) {
    const el = document.getElementById(id);
    if (!el) return;
    ['input','change'].forEach(evt => {
      el.addEventListener(evt, function () {
        const err = document.getElementById(errId);
        const ok  = test(this.value);
        if (this.type !== 'date' && this.tagName !== 'SELECT') {
          this.classList.toggle('valid',   ok);
          this.classList.toggle('invalid', !ok && this.value.length > 0);
        }
        if (err) err.style.display = (!ok && this.value.length > 0) ? 'block' : 'none';
        updateProgress();
      });
    });
  }

  // ── Submit via API ──
  document.getElementById('regForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!isFormValid()) return;

    const body = {
      firstName:   document.getElementById('firstName').value.trim(),
      surname:     document.getElementById('surname').value.trim(),
      age:         document.getElementById('age').value,
      gender:      document.querySelector('input[name="gender"]:checked')?.value,
      collegeName: document.getElementById('collegeName').value.trim(),
      course:      document.getElementById('course').value,
      branch:      document.getElementById('branch').value,
      startYear:   document.getElementById('startYear').value,
      endYear:     document.getElementById('endYear').value,
      cgpa:        document.getElementById('cgpa').value,
      email:       document.getElementById('email').value.trim(),
      phone:       document.getElementById('phone').value.trim(),
      linkedin:    document.getElementById('linkedin').value.trim(),
      city:        document.getElementById('city').value.trim(),
      pincode:     document.getElementById('pincode').value.trim(),
      state:       document.getElementById('state').value.trim(),
      country:     document.getElementById('country').value
    };

    const btn = document.getElementById('submitBtn');
    btn.disabled    = true;
    btn.textContent = 'SUBMITTING...';

    try {
      const res  = await fetch('/api/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
      });
      const json = await res.json();

      if (json.success) {
        showMsg('✅ ' + json.message, true);
        setTimeout(() => window.location.href = '/result?id=' + json.data.id, 800);
      } else {
        const errMsg = Array.isArray(json.errors) ? json.errors.join(' | ') : json.message;
        showMsg('❌ ' + errMsg, false);
        btn.disabled    = false;
        btn.textContent = 'SUBMIT';
      }
    } catch (err) {
      showMsg('❌ Network error: ' + err.message, false);
      btn.disabled    = false;
      btn.textContent = 'SUBMIT';
    }
  });

  function showMsg(msg, success) {
    const el = document.getElementById('apiMsg');
    if (!el) return;
    el.textContent      = msg;
    el.style.display    = 'block';
    el.style.background = success ? 'rgba(16,185,129,0.1)' : 'rgba(220,38,38,0.1)';
    el.style.border     = `1.5px solid ${success ? 'rgba(16,185,129,0.3)' : 'rgba(220,38,38,0.3)'}`;
    el.style.color      = success ? '#10b981' : '#dc2626';
    if (success) setTimeout(() => el.style.display = 'none', 3000);
  }

  updateProgress();
  updateSubmitBtn();
});