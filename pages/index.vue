<template>
  <article :class="$style.container">
    <header>
      <h1>
        Nuxt JS<br />
        serverMiddleware<br />
        mockup API
      </h1>
      <p>1.0.0</p>
    </header>

    <h2>sample</h2>
    <ul>
      <li>
        <nuxt-link to="/news">
          News articles of dummy
        </nuxt-link>
      </li>
    </ul>
    <footer>
      <small>
        GitHub:<a
          href="https://github.com/webdev-jp-net/nuxtjs-servermiddleware-api"
        >
          nuxtjs-servermiddleware-api
        </a>
      </small>
    </footer>
  </article>
</template>

<script>
export default {};
</script>

<style lang="scss" module>
.container {
  width: 40ch;
  max-width: calc(100% - 4rem);
  margin: 2rem auto;

  > header {
    h1 {
      margin: 4rem 0 0;
      font-size: 3rem;
      font-weight: 500;
    }
    p {
      margin: 1rem 0 0;
      font-size: 2rem;
      font-weight: 700;
    }
  }

  h2 {
    display: inline-flex;
    padding: 0.1em 0.5em;
    margin: 4rem 0 0;
    font-size: 1.2rem;
    font-weight: 500;
    color: white;
    background: black;
  }

  ul {
    padding: 0;
    margin: 2rem 0;
    list-style: none;
    border-top: 1px solid gray;

    li {
      padding: 0;
      margin: 0;
      border-bottom: 1px solid gray;

      a {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 0.9rem 3rem 0.9rem 1rem;
        margin: 0.1rem 0;
        font-size: 1.2rem;
        color: currentColor;
        text-decoration: none;

        transition: background-color 1s;

        &:hover {
          background-color: whitesmoke;
          transition: background-color 0.5s;
        }
        &::after {
          $code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 22"><polyline fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" troke-linejoin="round" stroke-miterlimit="10" points="11,20 2,11 11,2 "/></svg>';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          display: block;
          width: 1rem;
          height: 0.75rem;
          margin: auto 1rem;
          color: currentColor;
          content: '';
          background: url('data:image/svg+xml;charset=UTF-8,#{$code}') no-repeat
            right 60% center;
          transform: scaleX(-1);
        }
      }
    }
  }

  > footer {
    margin: 4rem 0 0;
    a {
      color: currentColor;
    }
  }
}
</style>
