const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
  }
];

const posts = [
  {
    id: '1',
    title: 'First post',
    body: 'Information',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'Second post',
    body: 'Information',
    published: true,
    author: '1',
  },
  {
    id: '3',
    title: 'Third post',
    body: 'Information',
    published: false,
    author: '2',
  }
];

const comments = [
  {
    id: '1',
    text: `Andrew's Comment`,
    author: '1',
    post: '1'
  },
  {
    id: '1',
    text: `Andrew's Comment`,
    author: '1',
    post: '1',
  },
  {
    id: '1',
    text: `Mike's Comment`,
    author: '3',
    post: '2',
  },
  {
    id: '1',
    text: `Sarah's Comment`,
    author: '2',
    post: '3',
  }
];

const db = {
  users,
  comments,
  posts,
};

export { db as default };
