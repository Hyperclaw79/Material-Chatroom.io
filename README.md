# `Material-Chatroom.IO` 
---

Just a simple live chat made using React, Material-UI and Socket.IO

Live version at: https://ui.break96.hasura-app.io 

**Features include**:
    
  - Custom Nickname, color picker and avatar.
  - Socket based communication - live update.
  - Dynamic list of online users.
  - Responsive design.
  - Custom commands: 
		- Status: Set Status with `/s {message}`.
		- Clear: Clear all the messages with `/clear`.
  - Whisper feature: `/w {nickname} {message}`
  - Beeps on new message.
  - Auto scroll
  - Text Formatting:
    - Bold: \*text\*
    - Italics: \_ text \_
    - Strikethrough: ~ text ~
    - Codeblock: \` text \`
  - Embeds 

Prerequisites
---

If you want to deploy/test it locally, use should have the latest [Node.js](https://nodejs.org/en/) installed.   
Make sure the following ports are free: 
   * 8080
   * 3000

Installing
---
   
This app is made with React. You can build React with Webpack and Babel but it is simpler to use Create-React-App by [@FacebookIncubators](https://github.com/facebookincubator).

Simply run `npm start` in the root directory to deploy the app automatically.

Deployment
---

The live version of this app is deployed using Hasura. Check out [Create-React-App docs](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment) on how to deploy to Heroku.

Future Updates
---
   * Support for avatar upload from local system
   * Authentication and Sessions 
   * More custom commands
   * Dashboard and multiple Chatrooms
   * Desktop notifications
   

Built With
---

   * [Create-React-App](https://github.com/facebookincubator/create-react-app)
   * [Socket.IO](https://socket.io/)
   * [Material-UI](www.material-ui.com/#/get-started/usage)

Authors
---

   * [Hyperclaw79](https://github.com/Hyperclaw79) 
   
Acknowledgements
---
 - [Hasura](hasura.io) for their amazing BaaS cli.
 - [Joe Harry](https://codepen.io/woodwork/) for his amazing Animated Form @[Codepen].(https://codepen.io/woodwork/full/pgLvEr/)
 - Any future contributors. 
    
