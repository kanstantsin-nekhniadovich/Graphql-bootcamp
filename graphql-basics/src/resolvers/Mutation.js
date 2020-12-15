import { v4 as uuidv4 } from 'uuid';

export const Mutation = {
  createUser(parent, args, { db }, info) {
    const { email } = args.user;
    const emailTaken = db.users.some(user => user.email === email);

    if (emailTaken) {
      throw new Error('Email is already taken');
    }

    const user = { id: uuidv4(), ...args.user };

    db.users.push(user);
    return user;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    const emailIsTaken = db.users.some(user => user.email === data.email);

    if (emailIsTaken) {
      throw new Error('This email is already taken');
    }

    return Object.assign(user, data);
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    
    if (!id) {
      throw new Error('Id is not defined');
    }

    const index = db.users.findIndex(user => user.id === id);
    
    if (index < 0) {
      throw new Error('User with such id was not found');
    }

    const deletedUsers = db.users.splice(index, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author === id;

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      db.comments = db.comments.filter(comment => comment.author !== id);

      return !match;
    });

    return deletedUsers[0];
  },
  createPost(parent, args, { db, pubsub }, info) {
    const { users, posts } = db;
    const { author } = args.post;
    const userExists = users.some(user => user.id === author);

    if (!userExists) {
      throw new Error('User with this id is not found');
    }

    const post = {
      id: uuidv4(),
      ...args.post,
    };

    posts.push(post);
    post.published && pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const post = db.posts.find(post => post.id === id);

    if (!post) {
      throw new Error('Post not found');
    }

    const updatedPost = Object.assign({}, post, data);

    if (typeof data.published === 'boolean') {
      if (post.published && !data.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: post,
          }
        });
      } else if (!post.published && data.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: updatedPost,
          }
        });
      }
    } else {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: updatedPost,
        }
      });
    }

    return updatedPost;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const index = db.posts.findIndex(post => post.id === id);

    if (index < 0) {
      throw new Error('Post not found');
    }

    const [post] = db.posts.splice(index, 1);
    db.comments = db.comments.filter(comment => comment.post !== id);
    post.published && pubsub.publish('post', { post: { mutation: 'DELETED', data: post }});
    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { users, posts, comments } = db;
    const { author, post } = args.comment;
    const userExists = users.some(user => user.id === author);

    if (!userExists) {
      throw new Error('Users is not exist');
    }

    const postExistsAndPublished = posts.some(({ id, published }) => id === post && published);

    if (!postExistsAndPublished) {
      throw new Error('Post is not exists or not published');
    }

    const comment = { id: uuidv4(), ...args.comment };
    comments.push(comment);
    pubsub.publish(`comment ${post}`, { comment: {
      mutation: 'CREATED',
      data: comment,
    } });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, text } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    const updatedComment = Object.assign({}, comment, { text });
    pubsub.publish(`comment ${updatedComment.post}`, { comment: { mutation: 'UPDATED', data: updatedComment } });
    return updatedComment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const { comments } = db;
    const { id } = args;

    const index = comments.findIndex(comment => comment.id === id);
    
    if (index < 0) {
      throw new Error('Comment not found');
    }

    const [comment] = comments.splice(index, 1);
    pubsub.publish(`comment ${comment.post}`, { comment: { mutation: 'DELETED', data: comment } });
    return comment;
  },
};
