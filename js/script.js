// Power Plates shared site behavior

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Newsletter form -> Web3Forms (async, no page reload)
  var forms = document.querySelectorAll('.web3form');
  forms.forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check
      var honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.checked) return;

      var data = new FormData(form);
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function (result) {
          if (result.success) {
            var okMsg = form.dataset.successMessage || "You're on the list. Welcome to the table.";
            if (status) { status.textContent = okMsg; status.className = 'form-status ok'; }
            form.reset();
          } else {
            if (status) { status.textContent = 'Something went wrong. Please try again.'; status.className = 'form-status err'; }
          }
        })
        .catch(function () {
          if (status) { status.textContent = 'Network error. Please try again.'; status.className = 'form-status err'; }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
        });
    });
  });

  // Homepage "Featured members": show 3 random members on every page load
  var featuredGrid = document.querySelector('#featured-members-grid');
  if (featuredGrid && typeof POWERPLATES_MEMBERS !== 'undefined') {
    var pool = POWERPLATES_MEMBERS.slice();
    // Fisher-Yates shuffle
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    var picks = pool.slice(0, 3);
    var html = picks.map(function (m) {
      return '' +
        '<div class="card">' +
          '<div class="plate-photo"><div class="plate-photo-inner"><img src="' + m.photo + '" alt="' + m.name + '"></div></div>' +
          '<span class="tag">Featured ' + m.month + '</span>' +
          '<h3>' + m.name + '</h3>' +
          '<p><strong>' + m.occupation + '</strong><br>' + m.company + '</p>' +
        '</div>';
    }).join('');
    featuredGrid.innerHTML = html;
  }

  // Homepage hero: rotating food photo inside the "Pull up a chair" circle
  var heroImg = document.querySelector('#hero-food-img');
  if (heroImg) {
    var heroPhotos = [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&h=600&q=80', // salmon plate
      'https://images.unsplash.com/photo-1619371000980-ec90e765eb32?auto=format&fit=crop&w=600&h=600&q=80', // pasta
      'https://images.unsplash.com/photo-1484980972926-edee96e0960d?auto=format&fit=crop&w=600&h=600&q=80', // salad with guacamole
      'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&h=600&q=80', // bowl of meat with sauce
      'https://images.unsplash.com/photo-1735183263607-3655df81fe3d?auto=format&fit=crop&w=600&h=600&q=80', // plate of food with wine
      'https://images.unsplash.com/photo-1603064432115-ddcd7e888bb7?auto=format&fit=crop&w=600&h=600&q=80'  // sliced fruit plate
    ];
    var heroIndex = 0;
    setInterval(function () {
      heroIndex = (heroIndex + 1) % heroPhotos.length;
      heroImg.style.opacity = 0;
      setTimeout(function () {
        heroImg.src = heroPhotos[heroIndex];
        heroImg.style.opacity = 1;
      }, 500);
    }, 4000);
  }

});
