# Social Presence Plugin for reveal.js

This is a plugin for the HTML presentation framework [reveal.js](https://revealjs.com/).
It aims at enhancing social presence in both synchronous and asynchronous presentations.
Its was developed mainly for higher education lecture slides.

Its features include:

- user accounts for both students and instructors
- virtual rooms bound to a presentation by its URL
- global chat for all participants in a room
- smaller private groups with their own chat
- social annotation with highlights similar to [hypothesis](https://web.hypothes.is/)
- visualization of other participants' cursors
- individual settings including a zen mode
- everything in realtime!

## Demo

**You can setup your own demonstration below:**

You can see a demo of this plugin in action by cloning this repository and running some commands.
You need node.js, yarn, and docker (with compose) installed.

If you have [asdf](https://asdf-vm.com/) installed, you can run `asdf install` in the `backend` and in the `demo` folder to install the correct node.js versions.
If not, install 16.15.1 for the backend folder, and 16.16.0 for the demo folder.
Don't forget to run `npm -g install yarn` to install yarn globally.
Additionally, the script `bin/mikro-orm` (wrapper for the CLI of the ORM) requires a global installation of `pwgen`.

First, run the backend:

```bash
cd backend
yarn install
docker-compose up --build

# run this only once to prepare the database as soon as everyhting is up and running
bin/mikro-orm migration:up
```

Then, the demo presentation:

```bash
# Run the frontend
cd demo
yarn install
yarn dev
```

Your admin panel is accessible at [http://localhost:4000/admin](http://localhost:4000/admin).
The presentation with the plugin is accessible at [http://localhost:3000](http://localhost:3000).

In order to create a virtual room for the presentation, you need to create a user account first.
In order to be able to create lectures, you need to have the role `instructor`.
For this, you need to execute the following command in the `backend/` folder (while your docker compose project is running):

```bash
bin/cli teachers register -e <email> -n <your_name> -p <password>
```

The flags `--color` and `--bio` are optional.

**Note that this command will also work in a production environment where your docker compose project is running.**

Normal users can just visit the presentation as a guest and click on the button in the top left corner.
Then, they can register a new account.

<img src="./assets/login.png" style="zoom: 33%;" />

Reload your presentation page, and play around!

## Installation

After setting up the backend necessary for this plugin (see [Backend](#backend)),
you can install it as a plugin for reveal.js.

First, install the the file `plugin/dist/social-presence.min.js` to your reveal.js plugin folder
as well as the stylesheet in `plugin/dist/social-presence.min.css`.

Then, add third-party dependencies to your page's `head` tag:

```html
<!-- React -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script> 
<!-- ReactDOM -->
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<!-- Socket.IO -->
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js" integrity="sha384-/KNQL8Nu5gCHLqwqfQjA689Hhoqgi2S84SNUxC3roTe4EhJ9AfLkp8QiQcU8AMzI" crossorigin="anonymous"></script>
```

Add the stylesheet belonging to this plugin:

```html
<link rel="stylesheet" href="plugin/social-presence/social-presence.min.css">
```

As a sibling element to your `div.reveal` element, add a `div` with the id `social-presence`:

```html
<div id="social-presence"></div>
<div class="reveal">
  <!-- ... -->
</div>
```

Add a script tag for this plugin alongside your other reveal.js script tags:

```html
<script src="plugin/social-presence/social-presence.min.js"></script>
```

### Configuration

Finally, in you `Reveal.initialize` function call, configure the plugin by providing a separate configuration object in the `socialPresence` property.
Also, initialize the plugin in the `dependencies` array like so:

```typescript
Reveal.initialize({
  // ...
  socialPresence: {
    // Social Presence plugin config
    apiURl: 'https://social-presence.example.com',
    socketUrl: 'https://social-presence.example.com:8080',
    // ...
  },
  // ...
  dependencies: [
    // ...
    {
      src: './plugin/social-presence/index.min.js',
      async: true,
      callback: () => {
        RevealSocialPresence.install()
      },
    },
  ]
})
```

The full list of configuration is as follows:

```ts
interface SocialPresenceConfig {
  /** The URL of the social presence server. */
  apiUrl: string

  /** The URL of the socket.io social presence server. */
  socketUrl: string

  /**
   * Whether to enable a global chat.
   *
   * @default true
   */
  chat?: boolean

  /**
   * Whether to enable breakout groups with chats.
   *
   * @default true
   * */
  groups?: boolean

  /**
   * Whether to enable the visibility of other users' cursors.
   *
   * @default true
   */
  cursors?: boolean

  /**
   * Whether to allow social annotations.
   *
   * @default true
   */
  annotations?: boolean
}
```

#### Notes

**Reveal.js Config**: Make sure not to enable the `mousewheel` navigation as elements of this plugin
are scrollable and this could result in unwanted navigation.

**Z-Index**: make sure to have lower z-indexes than 50, so the panel is not overlapped.

## Backend

The backend is [express.js](https://expressjs.com/)-based and built with the framework [Nest.js](https://nestjs.com/)
and exposes both a [socket.io](https://socket.io/) WebSocket and a [GraphQL](https://graphql.org/) API.
It also has an admin interface powered by [AdminJS](https://adminjs.co/).

### Requirements

When deploying this backend to a production environment, it requires the following services:

- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- An [AWS S3](https://aws.amazon.com/s3/) compatible storage provider
  - either S3 itself or a self-hosted [MinIO](https://min.io/) instance

### Deployment

Have a look at the [`Dockerfile`](./backend/Dockerfile) for a production-ready deployment.
As the GraphQL backend also exposes a native WebSocket for GraphQL realtime subscriptions and a Socket.IO WebSocket,
you need to expose port 5000 (GraphQL) and 8080 (Socket.IO) to the outside world.

For an example NginX configuration check out the [`nginx.conf`](./backend/config/api/nginx.conf) file for the API
and the [`nginx.conf`](./backend/config/socket/nginx.conf) file for the Socket.IO WebSocket.

### Backend Configuration

You need to configure the following environment variables:

```ts
interface ProcessEnv {
  /**
   * Email for the admin account of the admin panel
   * @default 'root@example.com'
   */
  ADMIN_USER: string

  /**
   * Password for the admin account of the admin panel
   * @default 'secret'
   */
  ADMIN_PASSWORD: string

  /**
   * The bucket name of the AWS S3 storage provider
   * @default 'content'
   */
  AWS_S3_BUCKET: string

  /**
   * The endpoint of the AWS S3 storage provider
   * @example 'https://s3.amazonaws.com'
   */
  AWS_S3_ENDPOINT: string

  /**
   * The region of the AWS S3 storage provider
   * @example 'eu-central-1'
   */
  AWS_REGION: string

  /**
   * The access key id for the AWS S3 storage provider
   */
  AWS_ACCESS_KEY_ID: string

  /**
   * The secret access key for the AWS S3 storage provider
   */
  AWS_SECRET_KEY: string

  /**
   * The URL of the PostgreSQL database
   * @example 'postgres://user:password@localhost:5432/database'
   */
  DATABASE_URL: string

  /**
   * The URL of the domain for the backend
   * @example 'social-presence.university.edu'
   */
  DOMAIN: string

  /**
   * The expiration time of the JWT token in a format readble by the `ms` package.
   * See https://www.npmjs.com/package/ms for more information.
   * @default '1m' // 1 minute
   */
  JWT_EXPIRATION_TIME: string

  /**
   * The environment in which the backend is running.
   * Should be 'production' once deployed.
   * @default 'development'
   */
  NODE_ENV: 'development' | 'production' | 'staging' | 'test'

  /**
   * The URL of the Redis database
   * @example 'redis://localhost:6379'
   */
  REDIS_URL: string

  /**
   * The expiration time of the refresh token in a format readble by the `ms` package.
   * See https://www.npmjs.com/package/ms for more information.
   * @default '0.25 year'
   */
  REFRESH_TOKEN_EXPIRATION_TIME: string

  /**
   * The secret key used to sign the JWT tokens.
   * Run `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
   * to generate one.
   */
  SECRET_KEY_BASE: string
}
```

### Admin Panel

Once deployed and configured, you can access the backend's admin panel at `/admin`.
There, you can view and manage all users and lecture (virtual rooms).

Simply log in with the credentials you configured in the environment variables. (`ADMIN_USER` and `ADMIN_PASSWORD`)

## Features

### Global Chat

Everyone can text each other in a global chat

<img src="./assets/global-chat.png" style="zoom: 20%;" />

### Participants

See all participants at once glance, and see who's currently online.
If you are an instructor, you can also choose to "kick" participants from the lecture.
Hovering anywhere over a participant's avatar will show a tooltip with their name, avatar, and bio.

<img src="./assets/participants.png" style="zoom: 33%;" />
<img src="./assets/user-info.png" style="zoom: 33%;" />

The cursors of other users on the same slide are also shown.

<img src="./assets/cursors.png" style="zoom: 33%;" />

When displaying the overview of the reveal.js presentation, small circles indicate how many participants are on each slide:

<img src="./assets/overview-presence.png" style="zoom: 20%;" />

### Groups

Any user can create private groups or join them by using a unique token:

<img src="./assets/group/join-group.png" style="zoom: 20%;" />
<img src="./assets/group/group.png" style="zoom: 20%;" />

Members of a group have a private chat.

<img src="./assets/group/group-chat.png" style="zoom: 20%;" />

However, per virtual lecture/room, only one group can be active at a time.

### Social annotations

Users can annotate the presentation with social annotations.

Whenever they select content from the slides, they can add a comment to it

<img src="./assets/annotation/annotate.png" style="zoom: 20%;" />
<img src="./assets/annotation/create-annotation.png" style="zoom: 20%;" />

They can also reply to other annotations in a thread.

<img src="./assets/annotation/annotation-thread.png" style="zoom: 20%;" />

When clicking on a highlight, users will see the annotation's dicussion thread pop up.
Additionally, when clicking on the quote of an annotation in the list, the user will navigate to the slide with the respective annotation.
The annotation list shows all annotations; first, the ones that are on the current slide, then the ones that are on other slides.

<img src="./assets/annotation/annotation-list.png" style="zoom: 20%;" />

### User profiles

Users can manage their own profile, including their name, avatar, and bio.

<img src="./assets/profile-settings.png" style="zoom: 20%;" />

### Individual settings

Users can also manage their individual settings:

<img src="./assets/individual-user-settings.png" style="zoom: 20%;" />

When enabling the Zen mode, the control strip at the top collapses to one button
and no notification badges, highlights, and cursors are shown.

<img src="./assets/zen-mode.png" style="zoom: 20%;" />

### Info panel

To see what virtual room/lecture participants have joined, the info button reveals some information about the lecture.

<img src="./assets/lecture-info.png" style="zoom: 20%;" />
