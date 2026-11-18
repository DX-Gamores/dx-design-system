# Cleanup: the last step of every process

> **Important:** a piece of work is not done until it is cleaned up. Every process in this repo (a Figma release, a pull request, a deploy change, an AI work session) ends with the checklist for that process below. Log what you cleaned up in the **Cleanup** line of the `docs/REVAMP-LOG.md` entry or the pull request.

Why it matters: leftover tokens can be misused, stale branches and old hosting confuse people about which version is real, and leftover build output and scratch files hide real changes and cost time (and AI tokens) in every later session.

## 1. Credentials (always first)

- [ ] **Revoke every access token** the moment the step that needed it is done (GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Delete).
- [ ] Tokens are **fine-grained, one repo, shortest expiry** (tomorrow), with only the permissions the step needs (usually Contents and, for workflow files, Workflows).
- [ ] Never commit a token or save it in git config, `.env` files, scripts or docs. An AI session uses it inline for one command and then checks that `git config --get-all http.extraHeader` is empty.
- [ ] If a token was pasted in a chat, treat it as exposed: revoke it even if it expires soon.

## 2. Branches and pull requests

- [ ] After a pull request is merged, **delete its branch** (the **Delete branch** button on the PR). Turn on **Settings → General → Automatically delete head branches** so GitHub does this for you.
- [ ] Close pull requests that won't be merged, and delete their branches.
- [ ] Delete branches a retired process used (for example `gh-pages`, deleted when GitHub Pages was retired).
- [ ] Locally: `git fetch --prune`, then delete local branches that are merged.

## 3. Build output and scratch files

- [ ] Don't commit build output or test output: `out/`, `.next/`, `test-results/`, `playwright-report/` (all in `.gitignore`).
- [ ] Delete scratch files, patches and exports you made along the way once their content is merged.
- [ ] `git status` is clean before you hand over: everything is either committed on the branch or deleted.

## 4. After a hosting or deploy change

- [ ] Only one live site. When something moves (for example GitHub Pages → Vercel), switch the old one off in the same piece of work: remove its CI job, turn off its setting, delete its branch.
- [ ] **Replace every old link**: `README.md`, `docs/`, the site (`src/`), the Figma file, the plan doc and the AI handoff file. Search with `grep -rn "<old address>" --exclude-dir=node_modules .`.
- [ ] Check who can see the new site (Vercel → Deployment Protection) by opening it in a private browser window.
- [ ] Update `docs/DEPLOY.md`.

## 5. After a Figma release

- [ ] Working pages and test frames stay out of the published library (they belong in the unpublished "DX Workshop" file).
- [ ] No detached instances, hidden test layers or leftover placeholder frames on published pages.
- [ ] Old links in the file point at the current docs site.

## 6. End of every AI work session

- [ ] Sections 1–4 above, as they apply.
- [ ] Remove anything the session left in its workspace: build output, scratch files, temporary worktrees.
- [ ] Add the `docs/REVAMP-LOG.md` entry with a **Cleanup** line (what was removed, what is left for Gab), and the same in the plan doc's Progress log.
- [ ] Remind Gab of anything only Gab can clean up (revoking a token, a setting in GitHub, Vercel or Figma).

## Where this checklist is used

| Process | Where it's written | Cleanup step |
| --- | --- | --- |
| Figma release | `docs/WORKFLOW.md` → Release steps | Step 7 |
| Building or changing a component | `docs/GETTING-STARTED.md` → Building a component | Step 5 |
| Every pull request | `.github/pull_request_template.md` | Cleanup checklist |
| Deploy and hosting changes | `docs/DEPLOY.md` | "Cleanup after a deploy change" |
| AI work sessions (v4 revamp) | `docs/REVAMP-LOG.md` and the AI handoff file, rule 7 | Cleanup line in every entry |
