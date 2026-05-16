# Galaxy Sport — Pages CMS Setup Guide

The website is built with **Eleventy** (turns content files into the website)
and edited through **Pages CMS** (pagescms.org) — a free editor that connects
to your GitHub repo. Hosting is **Netlify**.

This version uses Pages CMS instead of Decap because it handles GitHub login
for you — no OAuth apps, no Identity, no Git Gateway. Much simpler.

---

## What you have

```
galaxy-cms/
├── src/
│   ├── _data/          ← all editable content (JSON files)
│   ├── _includes/      ← shared template parts
│   ├── images/         ← photos and logos
│   ├── index.njk       ← the page template
│   ├── netlify.toml    ← Netlify build config
│   └── robots.txt
├── .eleventy.js        ← Eleventy config
├── .pages.yml          ← Pages CMS config (defines the editor)
├── .gitignore
└── package.json
```

---

## Step 1 — Update the project on GitHub

You already pushed the project to GitHub earlier. Now update it:

1. Replace the files in your local cloned repo folder with this new version.
2. In GitHub Desktop: commit ("Switch to Pages CMS") and push.

Important: the new `.pages.yml` file must be in the repo root. The old
`src/admin/` folder is gone — that's expected, Pages CMS doesn't need it.

---

## Step 2 — Netlify keeps working as-is

Your site already deploys from GitHub on Netlify. Nothing to change here —
when you push the update in Step 1, Netlify rebuilds automatically.

You can also now disable Netlify Identity and Git Gateway if you like —
they're no longer used. (Not required, just tidying up.)

---

## Step 3 — Open Pages CMS

This is the easy part — the part that replaces all the OAuth/Identity pain.

1. Go to **pagescms.org**
2. Click **Sign in** → **Sign in with GitHub**
3. Authorize Pages CMS to access your GitHub account
4. When asked which repositories, grant access to `galaxy-sport-website`
   (recommended) or all repos
5. Pages CMS shows your repos — click **galaxy-sport-website**
6. It reads the `.pages.yml` file and builds the editor automatically

No OAuth app, no helper service, no Identity. If you can sign into GitHub,
you can use the CMS.

---

## Step 4 — Edit content

Inside Pages CMS you'll see the sections in the sidebar: Hero, Dogodki,
Servis, O nas, Storitve, Galerija, FAQ, Zaključni poziv, Nastavitve.

1. Click any section
2. Edit the fields
3. Click **Save**
4. Pages CMS commits the change to GitHub
5. Netlify sees the commit and rebuilds — live in about a minute

---

## Step 5 — Give the client access

The client needs a (free) GitHub account, then:

**Option A — Add them as a repo collaborator**
1. GitHub → your repo → Settings → Collaborators → Add people
2. Enter the client's GitHub username
3. They accept the invite
4. They go to pagescms.org, sign in with GitHub, see the repo

**Option B — You handle edits**
If the client doesn't want a GitHub account, you can do their edits for
them in Pages CMS. You said earlier this is acceptable.

---

## How editing works from now on

- Edit in Pages CMS → Save → auto-commits → Netlify rebuilds → live in ~1 min.
- You can also edit code/design directly via GitHub Desktop.
- No more ZIP drag-and-drop — everything goes through Git.

---

## Editing locally (optional, for you)

1. Install Node.js from nodejs.org (LTS).
2. Open a terminal in the project folder.
3. Run `npm install` (first time only).
4. Run `npm start`.
5. Open http://localhost:8080 — live preview.

---

## Troubleshooting

**Pages CMS doesn't show my repo**
When signing in, make sure you granted access to the repo (or all repos).
Adjust at github.com → Settings → Applications → Pages CMS → Configure.

**The editor looks empty or wrong**
Pages CMS reads `.pages.yml` from the repo root. Make sure that file was
committed and pushed.

**A build fails on Netlify**
Check the deploy log (Deploys tab). Usually a typo in a JSON file in
`src/_data/` — JSON is strict about commas and quotes. Validate at
jsonlint.com.

**Changes don't go live**
Check the Deploys tab — a new deploy should trigger on every save.
