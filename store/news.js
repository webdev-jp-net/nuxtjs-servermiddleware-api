// NEWS
import { format } from 'date-fns';
import { cloneDeep, map } from 'lodash';
// STATE
const state = () => {
  return {
    total: 0,
    list: [],
    article: {},
    page: 1,
    max: 10,
  };
};

// GETTERS
const getters = {
  list: state => state.list,
  article: state => state.article,
  page: state => state.page,
  pageStatus: state => {
    return `${state.page} / ${Math.ceil(state.total / state.max)}`;
  },
  linearNavi: state => {
    return {
      preview: state.page > 1,
      next: state.page < Math.ceil(state.total / 10),
    };
  },
};

// MUTATIONS
const mutations = {
  setList(state, payload) {
    state.list = map(payload, article => {
      const result = cloneDeep(article);
      result.date = format(new Date(article.update), 'd MMM, yyyy');
      return result;
    });
  },
  setArticle(state, payload) {
    const result = cloneDeep(payload);
    result.date = format(new Date(payload.update), 'd MMM, yyyy');
    state.article = result;
  },
  // total
  setTotal(state, payload) {
    state.total = +payload;
  },
  // current page
  setPage(state, payload) {
    state.page = +payload;
  },
};

// ACTIONS
const actions = {
  /**
   * Get news articles
   *
   * @param { commit } commit
   * @param { Object } payload - paramaters
   * @param { number } payload.page - start page
   * @param { Object } payload.condition - Filter condition
   * @param { string } payload.condition.id - match id
   * @param { number } payload.max - Number of pages
   */
  async getNews({ commit }, payload) {
    const api = '/api/news';
    const paramsTemplate = {
      page: 1,
      condition: {},
      max: 10,
    };
    const params = Object.assign(paramsTemplate, payload);

    const data = await this.$axios
      .get(api, { params })
      .then(res => res.data.response);

    // get article
    if (params.condition.id) commit('setArticle', data.records[0]);
    // get list
    else {
      commit('setList', data.records);
      commit('setTotal', data.total);
      commit('setPage', data.page);
    }
  },
  // current page
  updatePage({ commit }, payload) {
    commit('setPage', payload);
  },
};

// EXPORT
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
