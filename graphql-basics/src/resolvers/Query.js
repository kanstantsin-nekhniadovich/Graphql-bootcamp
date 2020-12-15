export const Query = {
  data() {
    return 'data'
  },
  users(parent, args, { db }, infp) {
    return db.users;
  },
  grapes() {
    return [12, 12, 9, 5];
  },
  posts(parent, args, { db }, info) {
    const { query } = args;

    if (!query) {
      return db.posts;
    }

    return db.posts.filter((post) => {
      return post.body.toLowerCase().includes(query.toLowerCase()) || post.title.toLowerCase().includes(query.toLowerCase());
    });
  },
  add(parent, args, ctx, info) {
    const { a, b } = args;

    if (!a || !b) {
      return 0;
    }

    return a + b;
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};
