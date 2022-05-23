import { Main } from '@/templates/Main';

const About = () => (
  <Main title="About">
    <article className="prose p-4 lg:prose-xl">
      <h1>Welcome</h1>
      <p>
        This is a Pokémon teambuilder that works similarly to Pokemon Showdown in terms of editing, but it also allows multiple players to work on the same
        team. It means that your modifications will be mirrored in real time on the interfaces of all users in the same room. You may do this by simply sending
        your friends the room name/link to your team.
      </p>
      <p>
        You may start from scratch or import an existing Showdown paste to create a new team. You may also easily export your team to a Showdown importable or
        generate a PokePaste link.
      </p>
      <p>Known issues:</p>
      <ul>
        <li>Sometimes it does not work.</li>
        <li>
          No support for{' '}
          <a href="https://github.com/yjs/y-webrtc/issues/19" target="_blank" rel="noopener noreferrer">
            Safari and Chrome browsers to work together
          </a>{' '}
          on the same team.
        </li>
        <li>Please do not use Back and Forward button to enter a room.</li>
      </ul>
      <p>
        This is a work in progress. If you have any suggestions or questions, feel free to contact me on{' '}
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
