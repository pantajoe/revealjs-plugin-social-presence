(function () {
  'use strict';

  var config = Reveal.getConfig();

  if (config === null || typeof config.coursemod === 'undefined' || !config.coursemod.enabled)
      return;

  //disable when print-pdf is enabled
  if (window.location.href.indexOf('print-pdf') > -1)
      return;


  var holders = {
      presentation: undefined,
      lectureView: undefined
  };

  function loadStylesheet() {
      var path = undefined;
      [].slice.call(document.getElementsByTagName('script')).forEach(function(script){
          if(script.src.indexOf('coursemod.js') > - 1) {
              path = script.src.split('/').slice(0, -1).join('/')+'/';
          }
      });

      var link = window.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path + 'coursemod.css';
      window.document.getElementsByTagName('head')[0].appendChild(link);
  }

  function setup() {
      loadStylesheet();
      holders.presentation = document.querySelector('.reveal');
      holders.presentation.classList.add('coursemod__presentation');

      var lectureView = document.createElement('div');
      lectureView.classList.add('coursemod__lecture-view');
      holders.presentation.parentNode.insertBefore(lectureView, holders.presentation.nextElementSibling);
      holders.lectureView = lectureView;
  }

  function getSlideOverride(slide){
      if (typeof slide.dataset.coursemodShown !== 'undefined'){
          return slide.dataset.coursemodShown === 'true';
      }
      return undefined;
  }

  function toggleLectureView(show) {
      if(typeof show === 'undefined')
          show = config.coursemod.shown;
      if(show){
          holders.presentation.classList.add('coursemod--active')
          holders.lectureView.classList.add('coursemod--active')
      }else{
          holders.presentation.classList.remove('coursemod--active')
          holders.lectureView.classList.remove('coursemod--active')
      }
  }

  function updateNotes(currentSlide) {
      var notes = currentSlide.querySelector('aside.notes');
      if (notes !== null) {
          holders.lectureView.innerHTML = notes.innerHTML;
      } else if(currentSlide.hasAttribute('data-notes')){
          holders.lectureView.innerHTML = currentSlide.getAttribute('data-notes');
      } else {
          holders.lectureView.innerHTML = '';
      }
  }

  if (typeof config.coursemod.shown === 'undefined') {
      config.coursemod.shown = true;
  }

  setup();
  updateNotes(Reveal.getCurrentSlide());

  var slideOverride = getSlideOverride(Reveal.getCurrentSlide());
  if(typeof slideOverride === 'undefined'){
      toggleLectureView(config.coursemod.shown);
  }else{
      toggleLectureView(slideOverride);
  }

  Reveal.configure({
      keyboard: {
          86: function() {
              config.coursemod.shown = !config.coursemod.shown;
              toggleLectureView(config.coursemod.shown);
  Reveal.layout();
          }
      }
  });
  Reveal.registerKeyboardShortcut( 'V', 'Lectureware view' );

  Reveal.addEventListener( 'slidechanged', function( event ) {
      var currentSlide = event.currentSlide;
      if (typeof currentSlide.dataset.coursemodShown !== 'undefined'){
          var show = currentSlide.dataset.coursemodShown === 'true';
          toggleLectureView(show);
      }else {
          toggleLectureView(config.coursemod.shown);
      }
      updateNotes(currentSlide);
Reveal.layout();
  } );
}).call(this);
