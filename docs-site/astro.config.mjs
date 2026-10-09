starlight({
  title: '2064 Docs',
  favicon: '/img/favicon.ico',
  customCss: ['./src/styles/global.css'],
  plugins: [starlightQuiz()],
  logo: {
    src: './src/assets/team-logo.png',
    replacesTitle: false
  },
  social: [
    {
      icon: 'github',
      label: 'MkDocs source repository',
      href: 'https://github.com/FRC-2064/2064.team'
    },
    {
      icon: 'instagram',
      label: 'Team 2064 Instagram',
      href: 'https://www.instagram.com/frc2064/'
    }
  ],
  sidebar
})