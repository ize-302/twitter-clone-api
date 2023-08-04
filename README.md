# Twitter clone API 🐦

A tiny app implementing twitter core feature

#### Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [NodesJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) hosted on ([ElephantSQL](https://www.elephantsql.com/))

#### Database Structure / Relationships 💾

<iframe width="100%" height="500px" style="box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); border-radius:15px;" allowtransparency="true" allowfullscreen="true" scrolling="no" title="Embedded DrawSQL IFrame" frameborder="0" src="https://drawsql.app/teams/team-ize/diagrams/twitter-clone-db/embed"></iframe>

#### How to run 🏃

- Clone the repo
- Run `npm install` to install dependencies
- Create a .env file with content from [env.example](env.example)
- Run `npm run start:dev` to run in development mode
- This usually runs on port 3000 unless otherwise stated

#### Todos

- Refresh token implementation
- Timeline feed
- Fetch user's tweets, replies, liked tweets
- Retweet feature

### API Documentation

[API Documentation on Postman](https://documenter.getpostman.com/view/7097316/2s9XxyPsdx#cec8e4d7-9722-45f5-9da0-374a8c165fe0)
