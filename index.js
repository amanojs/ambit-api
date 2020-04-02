const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const connectDB = conditions => {
  return new Promise(resolve => {
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "ambit-admin",
      password: "ultrasoul",
      database: "ambit-test"
    });
    connection.connect(err => {
      if (err) {
        console.error("error connecting: " + err.stack);
        resolve();
      }

      console.log("connected");
      // root関数で作ったSQL文を使って検索
      connection.query(conditions, (err, results, fields) => {
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });
};

const app = express();

const typeDefs = gql`
  type User {
    user_id: String
    user_name: String
    gender: Int
    account_id: String
  }
  type Query {
    firstQuery: String
    secondQuery: String
    getUser: [User]
  }
`;

const resolvers = {
  Query: {
    firstQuery: () => "Hello,World",
    secondQuery: async () => {
      var hoge = 1000;
      hoge = (await hoge) * hoge;
      return hoge;
    },
    getUser: () => {
      return new Promise(resolve => {
        let conditions = "SELECT * FROM user_lists";
        connectDB(conditions).then(results => {
          resolve(results);
        });
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(
    `サーバーは4000番ポートで空いてるよ http://localhost:4000${server.graphqlPath} `
  )
);
