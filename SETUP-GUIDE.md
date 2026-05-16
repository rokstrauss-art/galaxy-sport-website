# Galaxy Sport — CMS Setup Guide

This guide takes the project from your computer to a live, client-editable website.
Work through it top to bottom. Total time: about 30–40 minutes.

The site is built with **Eleventy** (turns content files into the website) and
**Decap CMS** (the visual editor your client uses). Hosting and auto-deploy is
**Netlify**.

---

## What you have

The `galaxy-cms` folder contains the full project:

```
galaxy-cms/
├── src/
│   ├── _data/          ← all editable content (JSON files)
│   ├── _includes/      ← shared template parts
│   ├── admin/          ← the CMS editor (config.yml + index.html)
│   ├── images/         ← photos and logos
│   ├── index.njk       ← the page template
│   ├── netlify.toml    ← Netlify build config
│   └── robots.txt
├── .eleventy.js        ← Eleventy config
├── .gitignore
└── package.json
```

You never need to hand-edit the HTML again. Content lives in `src/_data/`,
and the client edits it through the CMS.

---

## Step 1 — Put the project on GitHub

Decap CMS saves changes by committing to a Git repository, so the project
must live on GitHub.

1. Go to **github.com** and sign in (or create a free account).
2. Click the **+** in the top-right → **New repository**.
3. Name it `galaxy-sport-website`.
4. Set it to **Private** (recommended).
5. Do **not** add a README, .gitignore, or license — leave those unchecked.
6. Click **Create repository**.

GitHub now shows a page with setup commands. You need to upload the project.
The simplest way without command-line tools:

**Option A — GitHub Desktop (easiest)**
1. Download **GitHub Desktop** from desktop.github.com and install it.
2. In GitHub Desktop: **File → Clone repository** → pick `galaxy-sport-website`.
3. It downloads an empty folder to your computer.
4. Copy everything from the `galaxy-cms` folder *into* that cloned folder.
5. Back in GitHub Desktop, you'll see all the files listed as changes.
6. Type a summary like "Initial site" and click **Commit to main**.
7. Click **Push origin**.

**Option B — Upload via browser** (works, but clumsier for folders)
GitHub's web upload doesn't handle nested folders well — Option A is strongly
preferred.

After this step, your project is on GitHub.

---

## Step 2 — Connect Netlify to the GitHub repo

You currently deploy by dragging a ZIP. That changes now — Netlify will build
the site automatically from GitHub.

1. Go to **app.netlify.com** and sign in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorize Netlify if asked.
4. Pick the `galaxy-sport-website` repository.
5. Netlify reads `netlify.toml` automatically, so the build settings should
   already be filled in:
   - Build command: `npm run build`
   - Publish directory: `_site`
6. Click **Deploy**.

Netlify installs Eleventy, builds the site, and publishes it. First build
takes 1–2 minutes. You'll get a URL like `random-name.netlify.app`.

**Important:** This creates a *new* Netlify site. Once you've confirmed it
works, you can delete the old drag-and-drop site, or rename this new one to
take over the `galaxysportss` name (Site configuration → Change site name).

---

## Step 3 — Turn on Netlify Identity (the client's login)

This is how the client logs into the CMS without needing a GitHub account.

1. In your new site's dashboard, go to **Integrations** (or **Site
   configuration → Identity** in some Netlify versions).
2. Find **Identity** and click **Enable Identity**.
3. Under **Identity → Registration**, set registration to **Invite only**
   (so randoms can't sign up).
4. Still under Identity, find **Services → Git Gateway** and click
   **Enable Git Gateway**. This is what lets the CMS save changes back to
   GitHub.

---

## Step 4 — Invite yourself (and the client) as editors

1. In the site dashboard → **Identity** tab.
2. Click **Invite users**.
3. Enter your own email first (to test), then the client's email.
4. Each person gets an email with a confirmation link. Clicking it lets them
   set a password.

---

## Step 5 — Test the CMS

1. Go to `your-site.netlify.app/admin`
2. Log in with the email/password you set up.
3. You should see the editor: Hero, Dogodki, Servis, O nas, Storitve,
   Galerija, FAQ, Zaključni poziv, Nastavitve.
4. Open **Hero**, change a word in the headline, click **Publish**.
5. Wait about a minute, refresh the main site — the change is live.

If that works, the CMS is fully operational.

---

## How editing works from now on

- **Client edits content:** they go to `/admin`, log in, change fields,
  hit Publish. Netlify rebuilds automatically. Live in ~1 minute.
- **You edit design/code:** edit files locally, commit and push via GitHub
  Desktop. Netlify rebuilds automatically.
- **No more ZIP drag-and-drop.** Everything goes through Git now. This is
  better — every change is versioned and reversible.

---

## Editing locally (optional, for you)

To preview changes on your own computer before pushing:

1. Install **Node.js** from nodejs.org (LTS version).
2. Open a terminal in the project folder.
3. Run `npm install` (first time only).
4. Run `npm start`.
5. Open `http://localhost:8080` — live preview that reloads as you edit.

---

## Troubleshooting

**The build fails on Netlify**
Check the deploy log (Deploys tab → click the failed deploy). Usually it's a
typo in one of the JSON files in `src/_data/` — a missing comma or quote.
JSON is strict. Validate the file at jsonlint.com.

**Client can't log in to /admin**
Make sure Identity is enabled (Step 3) and they accepted the email invite
(Step 4). The invite link expires — re-invite if needed.

**Images uploaded in the CMS don't show**
Decap saves uploads to `src/images/uploads/`. They appear after the next
build completes (~1 min). If they never appear, check Git Gateway is enabled.

**Changes in the CMS don't go live**
Check the Deploys tab — a new deploy should trigger on every Publish. If not,
Git Gateway may be disconnected; re-enable it in Identity settings.

---

## A note on the events

Events are a **list** in the CMS — under "Dogodki", the client can add a new
event, delete an old one, or drag to reorder. Each event has its own fields
(name, date, price, photo, etc.). Same for Galerija photos, FAQ questions,
and the hero photo rotation.

When an event is in the past, the client can simply delete it or you can
later add a "past events" archive — tell me if you want that built.
