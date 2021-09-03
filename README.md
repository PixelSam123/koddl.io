# koddl.io

Skribbl.io, but with a code editor instead of a drawpad.  
This is currently in Indonesian - I might write a translation

---

## IMPORTANT NOTICE (September 3, 2021)

Please read this notice if you are forking/contributing to this project.

The front-end implementation for this website might be heavily reworked in the future depending on a decision with these potential choices.

- Stay on a server view engine (ex. Nunjucks). This is the simplest implementation but probably won't lead to good developer experience.
- Standalone SvelteKit (Svelte) front-end. Svelte is known for its speed and excellent developer experience, but there currently is no way to integrate Svelte SSR (server-side rendering) with Fastify (correct me if I'm wrong)
- NextJS (React) front-end with direct SSR integration in Fastify using the [fastify-nextjs](https://github.com/fastify/fastify-nextjs). React code is more boilerplatey than Svelte but hey. Direct SSR integration.

I am also considering using more tools for backend such as:
- Redis

You can watch this project to get notified about my final decision. Feel free to open an issue if you want to help me decide.

## Deployment links

Heroku: <https://koddl-io.herokuapp.com>

## Running app locally

Use `npm run start` or `npm run dev`
