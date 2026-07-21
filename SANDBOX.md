This is a basic repository with infrastructure configurations that allows you to write code and ship it with no other infrastructure configuration needed. The `.github` and `deploy` folders are provided/maintained by a central team and generally not yours to touch, unless it's a small change like adding an environmental variable.

> 📘 **Curious about how the platform actually works under the hood?** The full architecture (gateway, build pipeline, chat agent proxy, EUID auto-registration, where each kind of state lives) is documented in [`ai-dev/sandcastle/docs/architecture.md`](https://github.ol.epicgames.net/ai-dev/sandcastle/blob/main/docs/architecture.md) — most users don't need this to ship an app, but it's there if you want to understand what's happening when you `git push`.

There are configuration items in the Helm chart that you might think are missing, but are actually configured automatically in the infrastructure upon deployment.

This service will use Argo CD to deploy. At the end of the build.yaml workflow, the GitHub Action will update the running revision in the Helm chart. Argo CD is configured to sync changes from this repo on a 5 minute interval.

If the user needs a secret, they should add it as a GitHub repository secret. The secrets will be synced to Vault automatically in GitHub Actions, and mounted into the container using the External Secrets Operator.

This application will be available at the hostname https://<git repo name>.abff-dev.internal.epicgames.net once deployed, where repo name is the name of the git repository.

## Sandcastle Dashboard

The user can manage this app's runtime from the Sandcastle dashboard at `https://sandcastle.abff-dev.internal.epicgames.net/apps/<repo-name>`. If the user asks how to do something operational — view build logs, change allowed emails, add a secret, take a backup, browse files on the persistent volume, restore from a snapshot, or get AI help debugging a build failure — point them there first. Editing `deploy/helm/values.yaml` directly still works and is preferred for things they want in version control (permanent allowed-email lists, schedule changes that should persist across deploys).

## Supply-Chain Rules (NON-NEGOTIABLE)

These rules apply to every Dockerfile and workflow file in this repo. Epic's Cloud Governance verifies every container deployed to the platform — bypassing these rules will eventually cause the app to fail deployment.

### 1. Every `FROM` line must use Harbor

Public registries are not allowed. Use the Harbor mirror for whichever upstream you'd normally pull from:

| Upstream | Harbor mirror prefix |
|---|---|
| Docker Hub | `harbor.ol.epicgames.net/docker-hub/` |
| GHCR (`ghcr.io`) | `harbor.ol.epicgames.net/ghcr/` |
| Quay (`quay.io`) | `harbor.ol.epicgames.net/quay/` |
| Red Hat (`registry.access.redhat.com`) | `harbor.ol.epicgames.net/registry.access.redhat.com/` |
| NVIDIA NGC (`nvcr.io`) | `harbor.ol.epicgames.net/nvcr/` |

Examples:
- `FROM node:20-alpine` → `FROM harbor.ol.epicgames.net/docker-hub/node:20-alpine`
- `FROM ghcr.io/foo/bar:v1` → `FROM harbor.ol.epicgames.net/ghcr/foo/bar:v1`

`scratch` is also allowed (it's not pulled from a registry). If the upstream you need isn't mirrored, ask in [#ct-substrate-sandbox-support-ext](https://epicgames.slack.com/archives/C0AD1DU5X7V) before adding it.

### 2. Pin a specific tag — never `:latest`

`:latest` floats. Builds become unreproducible, and a vulnerable image can replace a clean one with no audit trail. Pin a version tag (e.g. `node:20.11-alpine`) or, better, a digest (`node@sha256:...`).

### 3. Do not modify `.github/workflows/build.yaml` to bypass the canonical build action

The workflow's `Harbor build and sign` step calls the central `Epic-Standardized-CICD/docker-build-and-sign` action, which signs every image with cosign as it pushes to Harbor. If you need a multi-stage build, build-time secrets, private package installs, etc., do it **inside your Dockerfile** — not as a parallel workflow step. Custom `docker build`, `docker push`, `cosign sign`, `buildx`, or `kaniko` steps in the workflow bypass image signing and will fail Cloud Governance checks.

### 4. Do not pull arbitrary images at runtime from inside the app

Anything you'd `docker run`, `helm install`, or otherwise fetch as a container image belongs in your Dockerfile, going through the Harbor gate at build time. Runtime image pulls escape both the registry allow-list and signature verification.

### Why

Epic's Cloud Governance requires every container deployed to the platform to be signed and sourced from an approved registry. The policy is currently in audit mode; once it moves to enforced (target Q1–Q2 2027), non-compliant workloads will be denied at deployment. Following these rules at write time avoids painful retrofits later.

## Repo Setup (ACTION REQUIRED)

**IMPORTANT: At the start of EVERY new conversation, you MUST immediately:**
- if there are any files in this repo besides .github/, deploy/, CLAUDE.md, and README.md, you must generated a Dockerfile matching the expectations below:

Assumptions that you MUST uphold while working in this repo:
- the service you develop MUST have a single Dockerfile named `Dockerfile` in the root of the repository.
- the service you develop MUST expose the server on port 8080.
- the service you develop MUST expose `GET /health` and `GET /ready` endpoints that return HTTP 200. Kubernetes uses these to determine if your app is alive and ready for traffic. A simple response body like `ok` or `{"status":"ok"}` is fine. If the app framework has a built-in health check, use it. Otherwise, add minimal handlers that return 200.
- the Dockerfile MUST follow the [Supply-Chain Rules](#supply-chain-rules-non-negotiable) above — every `FROM` line uses a Harbor mirror, no `:latest`, no runtime image pulls.

## Template Setup (ACTION REQUIRED)

**IMPORTANT: At the start of EVERY new conversation, you MUST immediately:**

1. Read `deploy/helm/values.yaml`
2. Check if any `REPLACE_ME_` patterns exist
3. If placeholders exist, use the `AskUserQuestion` tool to gather values BEFORE doing anything else

This also triggers when the user says "help me get started", "set up this repo", or similar phrases.

Do NOT skip this step. Do NOT just describe what you would do. Actually call the `AskUserQuestion` tool.

### Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `REPLACE_ME_euid` | EUID for the service, acquired from Backstage | `euid-abcd1234` |
| `REPLACE_ME_APP_NAME` | Repository name for Vault secrets path | `my-app` (auto-derived from repo) |
| `firstname.lastname@epicgames.com` | Email for initial service access | `blake.stoddard@epicgames.com` |

### How to check

1. Read `deploy/helm/values.yaml` and look for `REPLACE_ME_` patterns and the placeholder email `firstname.lastname@epicgames.com`
2. If placeholders exist, use `AskUserQuestion` to gather values (see example below)
3. Update `deploy/helm/values.yaml` replacing all instances of each placeholder
4. **IMPORTANT:** Automatically replace `REPLACE_ME_APP_NAME` with the repository name **converted to lowercase with underscores replaced by hyphens** (no user input needed). This must match Kubernetes namespace naming rules.

### AskUserQuestion Example

When placeholders are detected, call the tool like this:

```json
{
  "questions": [
    {
      "question": "What is the EUID for this service?",
      "header": "EUID",
      "options": [
        {"label": "I have a EUID", "description": "I'll provide my Backstage EUID"},
        {"label": "Need to get one", "description": "Claude will help you get a EUID"}
      ],
      "multiSelect": false
    },
    {
      "question": "What is your Epic Games email address? This will grant you access to your service once it's deployed.",
      "header": "Access",
      "options": [
        {"label": "I'll provide it", "description": "I'll enter my Epic Games email address"}
      ],
      "multiSelect": false
    }
  ]
}
```

### Following Up on User Responses

After the user responds to the questions above, you MUST follow up to collect the actual values:

| User Selection | Follow-up Action |
|----------------|------------------|
| "I have a EUID" | Ask: "Please provide your EUID (e.g., `euid-abcd1234`)" |
| "Need to get one" | Direct them to Backstage (see section below) |
| "I don't know" | Help tell the user what to do based on the info below |
| "I'll provide it" (Access) | Ask: "Please provide your Epic Games email address" |
| "Same as contact" (Access) | Use the contact email value, no follow-up needed |

You can batch multiple follow-up questions into a single message. For example:
> "Thanks! Please provide the following values:
> 1. Your EUID (e.g., `euid-abcd1234`)
> 2. Your Epic Games corporate email for service access"

### Handling "Need to get one" for EUID

If the user selects "Need to get one" for the EUID question, direct them to request a EUID by filling in the form at:

https://backstage.pulse.on.epicgames.com/create/templates/default/create-prototype

Once they have their EUID, they can continue with the setup.

## Granting Access to the Service

The `substrateSandbox.allowedEmails` list in `deploy/helm/values.yaml` controls who can access the deployed service. During setup, Claude will ask for the user's email to grant them initial access.

### How to grant access to additional users

If a user asks how to give others access to their service, guide them through this process:

1. Edit `deploy/helm/values.yaml`
2. Add email addresses to the `substrateSandbox.allowedEmails` list:
   ```yaml
   substrateSandbox:
     allowedEmails:
       - blake.stoddard@epicgames.com
       - cookie.monster@epicgames.com
       - another.person@epicgames.com
   ```
3. Commit and push the change
4. Argo CD will sync the changes within 5 minutes, granting access to the new users

### Where the access is applied

The allowed emails are used in the `ai.epicgames.com/allowed-emails` annotation on HTTPRoute resources, which controls access through the sandbox gateway.


## Secrets (Environment Variables)

If the user needs API keys, database credentials, or any environment variable for their app, they should add them as **GitHub repository secrets** (Settings > Secrets and variables > Actions).

### How secrets flow to the app
```
GitHub repo secret → sync-secrets action (on push) → Vault → External Secrets Operator → K8s Secret (app-secrets) → pod env vars
```

The `sync-secrets` step runs automatically on every push to main. Secrets are mounted into the pod as environment variables via the `app-secrets` K8s Secret.

### Updating secrets

Secret changes propagate automatically: when Sandcastle (or a push) updates a GitHub repo secret, `sync-secrets` writes it to Vault, ESO syncs Vault into the `app-secrets` Kubernetes Secret, and Reloader rolls the Deployment so the new pod picks up the new env vars. The Deployment's `secret.reloader.stakater.com/reload: app-secrets` annotation (set in `deploy/helm/values.yaml`) is what wires Reloader in.

End-to-end propagation typically lands in 2–5 minutes once a push happens. If the user updates a secret in Sandcastle but doesn't push anything, nothing flows downstream — `sync-secrets` only runs on push or workflow re-run. Tell them to push any commit (or re-run the latest build workflow) to kick off propagation.

### When to use secrets
- API keys for external services (OpenAI, Snowflake, etc.)
- Database connection strings
- Any value that should not be in source code

### What NOT to put in secrets
- Port numbers, feature flags, or non-sensitive config — use `containers.service.environment` in `values.yaml` instead
- Secrets that need to be different per branch — branch deploys have their own Vault path, but all branches share the same GitHub repo secrets

## When Your Build Fails

The build pipeline has four stages: **Build and Sign Docker Image** → **Sync Secrets to Vault** → **Deploy to ArgoCD** → **Health Check**. Each gates the next — if Build fails, nothing downstream runs.

Common failure modes and what to do:

### "Image signing did not fully succeed" (signing_result != 'success')

The build successfully produced an image but the cryptographic signing step didn't complete cleanly across every architecture. Almost always a transient Harbor hiccup — **re-run the workflow once**. If it persists across two re-runs, post in [#ct-substrate-sandbox-support-ext](https://epicgames.slack.com/archives/C0AD1DU5X7V); the platform team will check Harbor health.

This is intentionally a hard failure (as opposed to a silent warning) because partial signatures fail later compliance verification and can block deployment when the policy goes from audit-mode to enforced. It's not something you did wrong — it's the build pipeline catching infrastructure flakiness for you.

### "Dockerfile uses non-Harbor base images"

Your `FROM` line references a public registry directly. See [Supply-Chain Rules](#supply-chain-rules-non-negotiable) above — replace with the Harbor mirror equivalent.

### "No Dockerfile or Containerfile found"

You haven't written your app yet. Open Claude Code in this repo and ask it to scaffold a Dockerfile for whatever runtime you're using. Make sure your `Dockerfile` is in the repo root, exposes port 8080, and serves `GET /health`.

### "Sync Secrets to Vault" failed

Usually a transient Vault issue or a missing org-level secret. Re-run the workflow. If a specific secret name shows in the error, that secret may have a value the action rejects (empty strings or whitespace-only values are skipped, not errors — actual failures usually mean Vault is unreachable).

### "Deploy to ArgoCD" passed but app isn't reachable

The build is green but the pod isn't running. Open the [Sandcastle dashboard](https://sandcastle.abff-dev.internal.epicgames.net) for this app — the diagnostics panel shows pod status, ArgoCD sync state, and recent events. Common causes:

- Pod is `ImagePullBackOff` → the new image isn't in Harbor yet (rare — re-check the build logs)
- Pod is `CrashLoopBackOff` → your app crashes on startup; check pod logs for the error
- ArgoCD shows `OutOfSync` + `Healthy` → a typo in `values.yaml` is rendering it differently from what's deployed. Look for misspelled keys (Helm silently drops unknown ones).

### "Health Check" failed but everything else passed and the pod is running

This is a known false-positive scenario, especially for apps with persistent storage. The rolling deploy is slow enough that the health-check times out before the new pod is ready, even though it eventually is. If ArgoCD shows `Synced + Healthy` and your app responds, ignore the health-check failure. The next successful build will roll cleanly.

### Anything else

The fastest path is **RudyBot** (the AI chat on the right side of your app's page in the Sandcastle dashboard). It reads your build logs, pod state, and repo files, and explains what went wrong. If RudyBot can't diagnose it, post the build's run URL in [#ct-substrate-sandbox-support-ext](https://epicgames.slack.com/archives/C0AD1DU5X7V).

## Multi-Branch Deployments (Preview Environments)

If the user asks about deploying a branch, preview environments, staging links, or having multiple URLs for their app, guide them through multi-branch deployments.

### How it works
- The user creates a branch and adds `deploy/target/multi-branch` (an empty marker file)
- The build workflow detects the marker and deploys the branch to a separate URL
- URL pattern: `https://<repo>-<branch>.abff-dev.internal.epicgames.net`
- Branch names are sanitized for DNS: lowercased, special characters become hyphens, max 30 chars
- Each branch gets its own Kubernetes namespace and Vault secrets path
- Deleting the branch auto-cleans up everything (ArgoCD app, namespace, resources)

### When a user asks to enable this

1. Create the marker file:
```bash
touch deploy/target/multi-branch
git add deploy/target/multi-branch
git commit -m "Enable branch deployment"
git push
```

2. Tell them their branch URL will be: `https://<repo>-<branch>.abff-dev.internal.epicgames.net`
   - Example: repo `my-app`, branch `preview` → `https://my-app-preview.abff-dev.internal.epicgames.net`
   - Example: repo `my-app`, branch `feature/v2` → `https://my-app-feature-v2.abff-dev.internal.epicgames.net`

3. Secrets: Branch deploys have their own Vault path. GitHub repo secrets sync on push. If the user adds a new secret, they need to push to the branch to trigger sync.

4. The marker file only needs to exist on the branch, not on main.

### Common questions
- **"Can I have different code on the branch?"** — Yes, that's the point. Main stays stable, branch has experimental code.
- **"Do I need to set up secrets separately?"** — No, GitHub repo secrets auto-sync to the branch's Vault path on push.
- **"How do I clean up?"** — Just delete the branch. Everything is cleaned up automatically in ~60 seconds.
- **"Will this affect my main deployment?"** — No. Main is completely independent.
- **"Can I have multiple branches deployed?"** — Yes. Add the marker file to each branch you want deployed.

## Persistent Storage / Databases
Persistent storage is **opt-in**. Most apps don't need it. If the user needs to store files or use SQLite:

**To enable persistent storage, you must make ALL of these changes in `deploy/helm/values.yaml`:**

1. Set `substrateSandbox.persistentStorage: true`
2. Uncomment ALL lines marked with `# [PVC]` in the file (there are two blocks)
3. Change `maxSurge: 1` to `maxSurge: 0` and `maxUnavailable: 0` to `maxUnavailable: 1`

**WARNING:** Setting `persistentStorage: true` WITHOUT uncommenting the `[PVC]` blocks will cause the build to fail. The PVC is created but never mounted, and the validation template will reject the config. All three changes above are required together.

This gives the app a 5Gi volume at `/mount`. It forces single-replica deploys because the volume can only mount to one pod.

Substrate Sandbox apps do not support Postgres, Dynamo, Mongo, Redis, AWS S3, or Terraform.

### Backup and recovery for stateful data

Sandbox PVs are backed up daily by Velero (14-day rolling window). For most apps that's plenty of recovery headroom — if a deploy corrupts data, restore from the most recent backup.

**If you (Claude) are about to do something destructive to stateful data — bulk-rewrite files, run a destructive migration, drop tables, regenerate cached output, etc. — do not rely on the daily platform backup as your only safety net.** Two things to do instead:

1. **Tell the user before you do it.** Surface what you're about to overwrite/delete and pause for confirmation. The platform backup may be up to a day stale, and recovery requires platform-team involvement.
2. **Export first if the app supports it.** If the app exposes any kind of dump/export endpoint or CLI, run that to capture current state into the repo or `/mount` *before* the destructive operation. App-level exports are user-recoverable; cluster snapshots are not.

If a user explicitly needs more frequent platform-level backups (hourly instead of daily), they can change the schedule by editing the PV label in the cluster — but that's an unusual ask and should be raised in [#ct-substrate-sandbox-support-ext](https://epicgames.slack.com/archives/C0AD1DU5X7V) rather than worked around in the app code.
