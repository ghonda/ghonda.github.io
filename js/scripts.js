!(function(i) {
  if ('function' == typeof define && define.amd) define(['jquery'], i);
  else if ('object' == typeof module && module.exports) {
    var t = require('jquery');
    i(t), (module.exports = t);
  } else i(jQuery);
})(function(i) {
  function t(i) {
    this.init(i);
  }
  (t.prototype = {
    value: 0,
    size: 100,
    startAngle: -Math.PI,
    thickness: 'auto',
    fill: { gradient: ['#3aeabb', '#fdd250'] },
    emptyFill: 'rgba(0, 0, 0, .1)',
    animation: { duration: 1200, easing: 'circleProgressEasing' },
    animationStartValue: 0,
    reverse: !1,
    lineCap: 'butt',
    insertMode: 'prepend',
    constructor: t,
    el: null,
    canvas: null,
    ctx: null,
    radius: 0,
    arcFill: null,
    lastFrameValue: 0,
    init: function(t) {
      i.extend(this, t),
        (this.radius = this.size / 2),
        this.initWidget(),
        this.initFill(),
        this.draw(),
        this.el.trigger('circle-inited');
    },
    initWidget: function() {
      this.canvas || (this.canvas = i('<canvas>')['prepend' == this.insertMode ? 'prependTo' : 'appendTo'](this.el)[0]);
      var t = this.canvas;
      if (
        ((t.width = this.size), (t.height = this.size), (this.ctx = t.getContext('2d')), window.devicePixelRatio > 1)
      ) {
        var e = window.devicePixelRatio;
        (t.style.width = t.style.height = this.size + 'px'), (t.width = t.height = this.size * e), this.ctx.scale(e, e);
      }
    },
    initFill: function() {
      function t() {
        var t = i('<canvas>')[0];
        (t.width = e.size),
          (t.height = e.size),
          t.getContext('2d').drawImage(g, 0, 0, r, r),
          (e.arcFill = e.ctx.createPattern(t, 'no-repeat')),
          e.drawFrame(e.lastFrameValue);
      }
      var e = this,
        a = this.fill,
        n = this.ctx,
        r = this.size;
      if (!a) throw Error('The fill is not specified!');
      if (('string' == typeof a && (a = { color: a }), a.color && (this.arcFill = a.color), a.gradient)) {
        var s = a.gradient;
        if (1 == s.length) this.arcFill = s[0];
        else if (s.length > 1) {
          for (
            var l = a.gradientAngle || 0,
              o = a.gradientDirection || [
                (r / 2) * (1 - Math.cos(l)),
                (r / 2) * (1 + Math.sin(l)),
                (r / 2) * (1 + Math.cos(l)),
                (r / 2) * (1 - Math.sin(l))
              ],
              h = n.createLinearGradient.apply(n, o),
              c = 0;
            c < s.length;
            c++
          ) {
            var d = s[c],
              u = c / (s.length - 1);
            i.isArray(d) && ((u = d[1]), (d = d[0])), h.addColorStop(u, d);
          }
          this.arcFill = h;
        }
      }
      if (a.image) {
        var g;
        a.image instanceof Image ? (g = a.image) : ((g = new Image()), (g.src = a.image)),
          g.complete ? t() : (g.onload = t);
      }
    },
    draw: function() {
      this.animation ? this.drawAnimated(this.value) : this.drawFrame(this.value);
    },
    drawFrame: function(i) {
      (this.lastFrameValue = i), this.ctx.clearRect(0, 0, this.size, this.size), this.drawEmptyArc(i), this.drawArc(i);
    },
    drawArc: function(i) {
      if (0 !== i) {
        var t = this.ctx,
          e = this.radius,
          a = this.getThickness(),
          n = this.startAngle;
        t.save(),
          t.beginPath(),
          this.reverse
            ? t.arc(e, e, e - a / 2, n - 2 * Math.PI * i, n)
            : t.arc(e, e, e - a / 2, n, n + 2 * Math.PI * i),
          (t.lineWidth = a),
          (t.lineCap = this.lineCap),
          (t.strokeStyle = this.arcFill),
          t.stroke(),
          t.restore();
      }
    },
    drawEmptyArc: function(i) {
      var t = this.ctx,
        e = this.radius,
        a = this.getThickness(),
        n = this.startAngle;
      i < 1 &&
        (t.save(),
        t.beginPath(),
        i <= 0
          ? t.arc(e, e, e - a / 2, 0, 2 * Math.PI)
          : this.reverse
          ? t.arc(e, e, e - a / 2, n, n - 2 * Math.PI * i)
          : t.arc(e, e, e - a / 2, n + 2 * Math.PI * i, n),
        (t.lineWidth = a),
        (t.strokeStyle = this.emptyFill),
        t.stroke(),
        t.restore());
    },
    drawAnimated: function(t) {
      var e = this,
        a = this.el,
        n = i(this.canvas);
      n.stop(!0, !1),
        a.trigger('circle-animation-start'),
        n
          .css({ animationProgress: 0 })
          .animate(
            { animationProgress: 1 },
            i.extend({}, this.animation, {
              step: function(i) {
                var n = e.animationStartValue * (1 - i) + t * i;
                e.drawFrame(n), a.trigger('circle-animation-progress', [i, n]);
              }
            })
          )
          .promise()
          .always(function() {
            a.trigger('circle-animation-end');
          });
    },
    getThickness: function() {
      return i.isNumeric(this.thickness) ? this.thickness : this.size / 14;
    },
    getValue: function() {
      return this.value;
    },
    setValue: function(i) {
      this.animation && (this.animationStartValue = this.lastFrameValue), (this.value = i), this.draw();
    }
  }),
    (i.circleProgress = { defaults: t.prototype }),
    (i.easing.circleProgressEasing = function(i) {
      return i < 0.5 ? ((i = 2 * i), 0.5 * i * i * i) : ((i = 2 - 2 * i), 1 - 0.5 * i * i * i);
    }),
    (i.fn.circleProgress = function(e, a) {
      var n = 'circle-progress',
        r = this.data(n);
      if ('widget' == e) {
        if (!r) throw Error('Calling "widget" method on not initialized instance is forbidden');
        return r.canvas;
      }
      if ('value' == e) {
        if (!r) throw Error('Calling "value" method on not initialized instance is forbidden');
        if ('undefined' == typeof a) return r.getValue();
        var s = arguments[1];
        return this.each(function() {
          i(this)
            .data(n)
            .setValue(s);
        });
      }
      return this.each(function() {
        var a = i(this),
          r = a.data(n),
          s = i.isPlainObject(e) ? e : {};
        if (r) r.init(s);
        else {
          var l = i.extend({}, a.data());
          'string' == typeof l.fill && (l.fill = JSON.parse(l.fill)),
            'string' == typeof l.animation && (l.animation = JSON.parse(l.animation)),
            (s = i.extend(l, s)),
            (s.el = a),
            (r = new t(s)),
            a.data(n, r);
        }
      });
    });
});

$(document).ready(function() {
  function toggleMenu() {
    $('.menu-mobile').on('click', function() {
      $('.menu-mobile').toggleClass('active');
      $('body').toggleClass('blockScroll');
      $('.nav').toggleClass('active');
    });
  }

  // Carousel
  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 25,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      430: {
        items: 2
      },
      720: {
        items: 3
      }
    }
  });

  // Scroll suave para link interno
  $('.nav-list a').on('click', function(e) {
    e.preventDefault();
    const id = $(this).attr('href'),
      targetTop = $(`[data-target="${id}"]`).offset().top,
      heightMenu = $('header').height();
    $('.menu-mobile').removeClass('active');
    $('body').removeClass('blockScroll');
    $('.nav').removeClass('active');
    $('html, body')
      .stop()
      .animate({ scrollTop: targetTop - 20 }, 500);
  });

  // Scroll suave para o topo
  $('.back-top').click(function(e) {
    e.preventDefault();
    $('html,body').animate({ scrollTop: 0 }, 500);
  });

  // Mudar para active o menu de acordo com a área
  $('[data-target]').each(function() {
    const sectionTop = $(this).offset().top;
    const sectionHeight = $(this).outerHeight(true);
    const heightMenu = $('header').height() + 1;
    const id = $(this).data('target');
    const target = $(`.nav-list a[href="${id}"]`);
    $(window).scroll(function() {
      const scrollTop = $(this).scrollTop();
      if (sectionTop - heightMenu < scrollTop && sectionTop + sectionHeight - heightMenu > scrollTop) {
        target.addClass('active');
      } else {
        target.removeClass('active');
      }
    });
  });

  // Ativar idiomas
  function ativaIdioma() {
    const item = $('.idioma-espanhol'),
      sectionTop = item.offset().top,
      sectionHeight = item.outerHeight();
    $(window).scroll(function() {
      const scrollTop = $(this).scrollTop(),
        windowHeight = $(this).height();
      if (sectionTop + sectionHeight < scrollTop + windowHeight) {
        $('.idioma-ingles').addClass('avancado');
        $('.idioma-espanhol').addClass('basico');
      }
    });
  }

  function ativaSkill() {
    const itens = $('[data-title-skill]');
    itens.each(function() {
      const item = $(this);
      const sectionTop = item.offset().top;
      const sectionHeight = item.outerHeight();
      $(window).scroll(function(e) {
        const scrollTop = $(this).scrollTop(),
          windowHeight = $(this).height();
        if (sectionTop + sectionHeight < scrollTop + windowHeight && !item.hasClass('active')) {
          item.addClass('active');
          const skillAtivada = item[0].dataset.titleSkill;
          switch (skillAtivada) {
            case 'frameworks': {
              ativaSkill('frameworks', skillFramework());
              break;
            }
            case 'linguagens': {
              ativaSkill('linguagens', skillLinguagens());
              break;
            }
            case 'banco': {
              ativaSkill('banco', skillBanco());
              break;
            }
            case 'front': {
              ativaSkill('front', skillFront());
              break;
            }
            case 'versionamento': {
              ativaSkill('versionamento', skillVersionamento());
              break;
            }
            case 'gerenciamento': {
              ativaSkill('gerenciamento', skillGerenciamento());
              break;
            }
            case 'metodologia': {
              ativaSkill('metodologia', skillMetodologia());
              break;
            }
          }
        }
      });
    });
  }

  function skillFramework() {
    startSkill('asp', 0.65);
    startSkill('net', 0.86);
    startSkill('core', 0.82);
    startSkill('nancy', 0.72);
  }

  function skillLinguagens() {
    startSkill('csharp', 0.93);
    startSkill('delphi', 0.33);
  }

  function skillBanco() {
    startSkill('sqlserver', 0.67);
    startSkill('postgre', 0.55);
    startSkill('mysql', 0.45);
    startSkill('firebird', 0.21);
  }

  function skillFront() {
    startSkill('html', 0.55);
    startSkill('css', 0.48);
    startSkill('js', 0.42);
    startSkill('jquery', 0.41);
    startSkill('angular', 0.3);
    startSkill('bootstrap', 0.34);
  }

  function skillVersionamento() {
    startSkill('git', 0.82);
    startSkill('tortoise', 0.45);
    startSkill('tfs', 0.49);
  }

  function skillGerenciamento() {
    startSkill('bower', 0.38);
    startSkill('npm', 0.29);
  }

  function skillMetodologia() {
    startSkill('scrum', 0.65);
    startSkill('tdd', 0.58);
  }

  function startSkill(elem, valor) {
    $(`[data-skill="${elem}"]`).circleProgress({
      startAngle: (-Math.PI / 4) * 2,
      value: valor,
      emptyFill: 'rgba(0, 0, 0, 0)',
      lineCap: 'round',
      fill: { color: '#f06000' }
    });
  }

  toggleMenu();
  ativaIdioma();
  ativaSkill();
});
