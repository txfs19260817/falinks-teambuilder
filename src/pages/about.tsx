import { Main } from '@/templates/Main';

const About = () => (
  <Main title="About">
    <article className="prose p-4 lg:prose-xl">
      <h2>Welcome</h2>
      <p>
        Falinks Teambuilder is an online Pokémon teambuilder that lets you create Pokémon teams and work with other people. It also aims to ship the similar
        experience as the Pokémon Showdown teambuilder.
      </p>
      <p>
        You may start from scratch or import an existing Showdown paste to create a new team. You may also easily export your team to a Showdown importable or
        generate a PokePaste link.
      </p>
      <h3>Known issues</h3>
      <ul>
        <li>
          WebRTC provider do not support for{' '}
          <a href="https://github.com/yjs/y-webrtc/issues/19" target="_blank" rel="noopener noreferrer">
            Safari and Chrome browsers to work together
          </a>{' '}
          on the same team. In this case, you may try WebSocket provider.
        </li>
        <li>Please do not use Back and Forward button to enter a room to avoid unexpected behavior.</li>
        <li>Cross provider collaboration is not supported. In other words, both provider and room name should match.</li>
      </ul>
      <p>
        This is a work in progress. There are still many features to be added. If you have any suggestions or questions, feel free to contact me on{' '}
        <a href="https://twitter.com/dora_865" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>{' '}
        or leave your questions on the{' '}
        <a href="https://github.com/txfs19260817/falinks-teambuilder/issues" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </article>
  </Main>
);

export default About;
