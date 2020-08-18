<template>
  <article :class="$style.article">
    <header>
      <h1>{{ article.title }}</h1>
      <p>{{ article.author }}</p>
    </header>
    <figure :class="$style.figure">
      <img :src="article.img" :alt="`[photo]${article.title}`" loading />
    </figure>
    <p>{{ article.body }}</p>

    <footer>
      <p>{{ article.date }}</p>
    </footer>
  </article>
</template>
<script>
export default {
  name: 'NewsArticle',
  async asyncData({ store, route }) {
    const current = await store.getters['news/article'];
    if (!current.date)
      await store.dispatch('news/getNews', {
        condition: { id: route.params.id },
      });
  },
  computed: {
    article() {
      return this.$store.getters['news/article'];
    },
  },
  methods: {
    getArticle(id) {
      this.$store.dispatch('news/getNews', { condition: { id } });
    },
  },
};
</script>
<style lang="scss" module>
.article {
  width: 40ch;
  max-width: calc(100% - 4rem);
  margin: 2rem auto;

  > header {
    margin: 2rem 0 0;

    h2 {
      font-size: 2rem;
    }

    p {
      margin: 1rem 0 0;
    }
  }

  > footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    margin: 2rem 0 0;
  }
}

.figure {
  margin: 2rem 0 0;
  img {
    max-width: 100%;
  }

  + p {
    margin: 2rem 0 0;
    line-height: 1.8;
  }
}
</style>
