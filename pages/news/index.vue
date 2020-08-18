<template>
  <article :class="$style['article-list']">
    <header>
      <h2>News</h2>
    </header>
    <ul :class="$style.body">
      <li v-for="article in resultList" :key="article.id">
        <nuxt-link :to="`/news/${article.id}`">
          <p>{{ article.title }}</p>
          <span>{{ article.date }}</span>
        </nuxt-link>
      </li>
    </ul>
    <footer>
      <button
        type="button"
        :disabled="!linearNavi.preview"
        @click="actPreview"
      ></button>
      <span>{{ pageStatus }}</span>
      <button
        type="button"
        :disabled="!linearNavi.next"
        @click="actNext"
      ></button>
    </footer>
  </article>
</template>
<script>
export default {
  name: 'NewsList',
  beforeRouteUpdate(to, from, next) {
    const page = to.query.page || 1;
    this.getList(page);
    window.scroll(0, 0);
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (from.name === 'news' && to.name === 'news-id') {
      const cash = find(this.resultList, { date: to.params.id });
      if (cash) this.$store.dispatch('news/updateCash', cash);
      else
        this.$store.dispatch('news/getNews', {
          condition: { id: to.params.id },
        });
    }
    next();
  },
  computed: {
    resultList() {
      return this.$store.getters['news/list'];
    },
    page() {
      return this.$store.getters['news/page'];
    },
    pageStatus() {
      return this.$store.getters['news/pageStatus'];
    },
    linearNavi() {
      return this.$store.getters['news/linearNavi'];
    },
  },
  created() {
    if (!this.resultList.length) {
      const page = this.$route.query.page || 1;
      this.getList(page);
    }
  },
  methods: {
    getList(page, period) {
      this.$store.dispatch('news/updatePage', +page);
      this.$store.dispatch('news/getNews', { page, period });
    },
    actNext() {
      this.$store.dispatch('news/updatePage', this.page + 1);
      this.$store.dispatch('news/getNews', {
        page: this.page,
      });
      this.$router.push(`?page=${this.page}`);
    },
    actPreview() {
      this.$store.dispatch('news/updatePage', this.page - 1);
      this.$store.dispatch('news/getNews', {
        page: this.page,
      });
      this.$router.push(`?page=${this.page}`);
    },
  },
};
</script>
<style lang="scss" module>
.article-list {
  width: 40ch;
  max-width: calc(100% - 2rem);
  margin: 2rem auto;

  > header {
    margin: 2rem 0 0;

    h2 {
      margin: 0 1rem;
      font-size: 2rem;
    }
  }

  > footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    margin: 4rem 0 0;

    button {
      position: relative;
      display: inline-flex;

      padding: 1rem;
      font-size: 1rem;
      background-color: white;
      border: none;
      appearance: none;

      transition: background-color 1s, opacity 1s;

      &:focus,
      &:hover {
        background-color: whitesmoke;
        transition: background-color 0.5s, opacity 0.5s;
      }

      &:hover {
        cursor: pointer;
      }

      &:disabled {
        opacity: 0;
      }

      &::before,
      &::after {
        $code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 22"><polyline fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" troke-linejoin="round" stroke-miterlimit="10" points="11,20 2,11 11,2 "/></svg>';
        display: block;
        width: 1rem;
        height: 1rem;
        color: currentColor;
        content: '';
        background: url('data:image/svg+xml;charset=UTF-8,#{$code}') no-repeat
          right 60% center;
      }

      &::after {
        transform: scaleX(-1);
      }

      &:first-child::after,
      &:last-child::before {
        content: none;
      }
    }
  }
}
.body {
  padding: 0;
  margin: 2rem 0;
  list-style: none;
  border-top: 1px solid gray;

  li {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid gray;

    a {
      display: flex;
      flex-direction: column;
      padding: 0.9rem 1rem;
      margin: 0.1rem 0;
      color: black;
      text-decoration: none;

      transition: background-color 1s;

      &:hover {
        background-color: whitesmoke;
        transition: background-color 0.5s;
      }

      p {
        overflow: hidden;
        font-size: 1.2rem;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span {
        margin-top: 0.5em;
        font-size: 1rem;
        color: gray;
      }
    }
  }
}
</style>
