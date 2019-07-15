Case for TV2

Build a weather widget using nodejs and React

## Get it running

### Install dependencies
```sh
npm install
```

### Start the server
```sh
npm start
```

### Run tests
```sh
npm test
```

## Isomorphic react application

There is no idiomatic way to build an isomorphic react application; there are many. Here are some of the alternatives I didn't pursue.

`react-server` defines explicit serverside events that are helpful, e.g. when getting data serverside. You might want to render components differently depending on whether they are on the client and server, react-server has specific lifecycle events to help with that.

`razzle` comes with a ton of sensible defaults and have hot reloading on both server and client. It uses react-router out of the box, and is easily extended with redux.

`nextjs` is a magic box of isomorphic react. It defaults to codesplitting on pages, which is mostly what you what. However, if something is not explicitly supported, it's easy to get stuck.

All come with some sort of test framework. However, strangely none of them use my favourite tool for react testing; `enzyme`.

## What I did

Building an express website is easy: Use express-generator to set up a website, complete with routes, views, error handling and logging. Then build the website completely serverside. I chose handlebars as view engine. 

Then, in a separate folder, run create-react-app to build the same website clientside (add the proxy option in package.json to use the api built in step 1). When you are done, simply build the react website and use the resulting assets when loading the server-rendered page.

Except, when building create-react-app the bundled output files receive new hashed filenames for endless caching at every build, so referencing them from serverside is a bother. I chose the the easy way to solve it and made a small script to use create-react-app's index.html as the layout file in handlebars. That way, the server and client is in sync when running `npm start`.

I like the ease of create-react-app, but in hindsight it probably would have been just as easy to configure webpack from the start.

## Design decisions

### Client

The React client lives in the client folder. I'm using redux with a ducks pattern. Rather than splitting up into folders of reducers, actions, components, etc, I opted for just one folder with components. Components are divided into domains - only the weather domain for now. Most components will be stateless components. If a component requires state it will be handled by redux, and signalled by the filename [Component].container.js that this is a stateful component. A container has a corresponding [Component].ducks.js for actions and reducers and of course the [Component].js where the stateless component lives. This stateless component can also be rendered serverside (with some webpack magic).

### Server

The server is straight forward. There are 2 routes files `index` for serving the homepage and `api` for exposing the api. The logic for handling the api is seperated into `/lib/openweathermap.js` so that it can be reused from both the api router (to expose clientside) and the pages router (serverside). Other than the standard boilerplate there is a `/static` route that targets the build folder of create-react-app. The API_KEY for openweathermap can be set in environment variable if needed.

### History

Maintaining history clientside is done by using `history`. I considered using `react-router` to manage history, and routing in general. In an actual application with more pages and components I probably would recommend that. However, for this it wasn't needed. It would neither have increased or reduced complexity. `history` is no longer shipped with react-router, and so would have required the same code to push history state into the client anyway. For this reason, I decided yolo, and kept it simpler without client routes.


## Test

I'm using jest for testing. I must confess I never use jest. When jest just came out I tried it, and found that it was too slow. Back then we used karma + jasmine instead. These days, I almost always use mocha. Regardless, this was a fun opportunity to use jest, and I can say it's faster than before, but still slow. Nevertheless, mocking functions and async apis are easy, and with enzyme, testing react components is like using mocha without the need for extra setup.

Testing a redux app is easy since actions and reducers are plain functions (for this reason, I actually didn't bother). The fun part comes when putting it all together. `WeatherWidget` is a stateless component, so all we need to test is that props are rendered correctly, and callbacks are invoked when buttons are pressed. `WeatherWidget.ducks` have some fun bits with thunks that call an api, so that needs to be mocked and then checked that the corresponding actions are triggered. Finally, we put it all together with a real store in `WeatherWidget.container` to test the whole thing.

