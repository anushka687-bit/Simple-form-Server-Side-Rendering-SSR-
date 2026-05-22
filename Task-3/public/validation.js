// Live validation on blur
document.addEventListener('DOMContentLoaded', function () {

  const rules = {
    name:  v => v.trim().length >= 2,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: v => /^[0-9]{10}$/.test(v.trim()),
    age:   v => { const n = parseInt(v); return !isNaN(n) && n >= 1 && n <= 120; }
  };

  ['name','email','phone','age'].forEach(function(id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', function () {
      const ok = rules[id](this.value);
      this.classList.toggle('valid',   ok);
      this.classList.toggle('invalid', !ok && this.value.length > 0);
      const err = document.getElementById(id + 'Err');
      if (err) err.style.display = (!ok && this.value.length > 0) ? 'block' : 'none';
    });
  });

  // Gender highlight
  document.querySelectorAll('input[name="gender"]').forEach(function(r) {
    r.addEventListener('change', function() {
      document.getElementById('genderErr').style.display = 'none';
    });
  });
});

function validateForm() {
  let valid = true;

  const checks = [
    { id: 'name',  test: v => v.trim().length >= 2,                        errId: 'nameErr'   },
    { id: 'email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), errId: 'emailErr'  },
    { id: 'phone', test: v => /^[0-9]{10}$/.test(v.trim()),                errId: 'phoneErr'  },
    { id: 'age',   test: v => { const n=parseInt(v); return !isNaN(n)&&n>=1&&n<=120; }, errId: 'ageErr' }
  ];

  checks.forEach(function(c) {
    const el  = document.getElementById(c.id);
    const err = document.getElementById(c.errId);
    if (!c.test(el.value)) {
      err.style.display = 'block';
      el.classList.add('invalid');
      el.classList.remove('valid');
      valid = false;
    } else {
      err.style.display = 'none';
      el.classList.add('valid');
      el.classList.remove('invalid');
    }
  });

  const gender = document.querySelector('input[name="gender"]:checked');
  const gErr   = document.getElementById('genderErr');
  if (!gender) { gErr.style.display = 'block'; valid = false; }
  else           gErr.style.display = 'none';

  return valid;
}