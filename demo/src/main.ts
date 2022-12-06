import './styles/highlightjs/monokai.css'
import './styles/main.css'

Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  slideNumber: 'c/t',
  rollingLinks: false,
  keyboard: true,
  // deactivate mousewheel navigation as it inteferes with scrollable elements like the participants list
  mouseWheel: false,
  fragmentInURL: true,
  hashOneBasedIndex: false,
  pdfSeparateFragments: false,
  overview: true,
  transition: 'fade',
  transitionSpeed: 'default',
  showNotes: false,
  coursemod: {
    enabled: true,
    shown: false,
  },
  audioStartAtFragment: false,
  audio: {
    prefix: 'audio/',
    advance: -1,
    autoplay: false,
    defaultDuration: 0,
    defaultAudios: false,
    playerOpacity: 0.8,
    playerStyle: 'position: fixed; bottom: 9.5vh; left: 0%; width: 30%; height:30px; z-index: 5;',
  },
  // The "Social Presence" plugin configuration
  socialPresence: {
    apiUrl: 'http://localhost:4000',
    socketUrl: 'http://localhost:8080',
  },
  plugins: [RevealMarkdown, RevealNotes, RevealSearch, RevealZoom, RevealAudioSlideshow],
  dependencies: [
    {
      src: './plugin/toc-progress/toc-progress.js',
      async: true,
      callback: () => {
        toc_progress.initialize('reduce', 'rgba(120,138,130,0.2)', 'body');
        toc_progress.create();
      },
    },
    {
      src: './plugin/quiz/js/quiz.js',
      async: true,
      callback: () => {
        prepareQuizzes({ preventUnanswered: true, skipStartButton: true });
      },
    },
    { src: './plugin/coursemod/coursemod.js', async: true },
    // Initialize the "Social Presence" plugin last
    {
      src: './node_modules/revealjs-plugin-social-presence/dist/index.min.js',
      async: true,
      callback: () => {
        RevealSocialPresence.install();
      },
    },
  ],
})
