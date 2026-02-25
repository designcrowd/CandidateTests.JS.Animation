# Animation Editor

A simplified Vue 3 + Fabric.js animation editor built for technical interviews.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

You'll see a canvas editor with some objects (text, shapes) and a sidebar with animation controls. There's a working **Fade In** animation — select an object, apply Fade In, and click Play to see it in action.

**Spend time reading through the code.** Understand how the code works. The project uses [Fabric.js 5.3.0](http://fabricjs.com/docs/) for canvas rendering — you probably haven't used it before, so take a look at the docs too.

**You don't need to build anything ahead of time.** Just come familiar with the codebase.

## What to Expect

The interview is about **90 minutes** and has four parts:

| Time | Section | What |
|------|---------|------|
| ~10 min | **Code understanding** | Show us around the code, explain how things work |
| ~45 min | **Live coding with AI** | Design a solution, then implement it with your AI tool |
| ~25 min | **System design** | Discuss how you'd approach a bigger problem |
| ~5 min | **Q&A** | Your questions for us |

### Bring your AI tool

ChatGPT, Claude, Copilot, Cursor — whatever you normally use. We use AI tools heavily in our team and we want to see how you work with them.

### Think out loud

We want to hear your reasoning, not just see the result. Tell us what you're considering, what trade-offs you see, and why you're making the choices you're making.

### It's OK to not know things

Saying "I'm not sure, but I'd try..." is better than guessing. The codebase uses some patterns you may not have seen before — that's fine.

### Ask questions

If something is unclear, ask. This is a conversation, not an exam.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint + type-check |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run test` | Run unit tests |

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Fabric.js 5.3.0** — Canvas rendering
- **TypeScript** — Strict mode
- **Vite** — Build tooling
- **Tailwind CSS** — Utility-first styling

## Questions?

If you have trouble setting up the project, reach out and we'll help.

See you at the interview!
