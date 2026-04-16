# Sentry → Devin Alert Pipeline

## Description
Add or modify Sentry alert rules that automatically trigger Devin sessions to investigate and triage errors in the React banking app.

## Architecture

```
React App (src/) → Sentry SDK captures error with feature tag
    → Sentry Alert Rule filters by tag, sends webhook
    → Webhook Service (https://app-ixyrbrvl.fly.dev/webhook/sentry)
    → Devin API creates triage session
```

**Key components:**
- **Sentry SDK config:** `src/sentry.ts` — DSN, environment (`process.env.NODE_ENV`), replay, tracing
- **Webhook service:** Deployed at `https://app-ixyrbrvl.fly.dev/` — FastAPI app that receives Sentry alert webhooks and calls `POST https://api.devin.ai/v3/organizations/{org_id}/sessions`
- **Sentry org:** `none-b41` | **Project:** `javascript-react`
- **Sentry integration settings:** `https://none-b41.sentry.io/settings/developer-settings/devin-98488c/`
- **Existing alert rule:** "Send Money Transfer Error → Devin" (ID 16920403) — triggers on `feature` contains `send_money`

## Procedure: Adding a New Alert

### Step 1 — Instrument the error in the React app

In the relevant page/component, capture the error with a `feature` tag:

```tsx
import { Sentry } from '../sentry';

try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: '<feature_tag>',   // e.g. 'checkout', 'auth', 'send_money'
      step: '<step_name>',         // e.g. 'payment_processing', 'validation'
    },
    extra: {
      // contextual data for Devin to analyze during triage
    },
  });
}
```

The `feature` tag is what the alert rule filters on. The `extra` object gives Devin context when investigating.

### Step 2 — Verify the error reaches Sentry

1. Run the app locally: `yarn start`
2. Trigger the error in the browser
3. Check `https://none-b41.sentry.io/issues/?query=feature:<tag_value>` — confirm the issue appears with correct tags

### Step 3 — Create the Sentry alert rule

Log into Sentry at `https://none-b41.sentry.io/` and navigate to **Alerts → Create Alert Rule → Issue Alert**.

Configure:
- **WHEN:** Choose one:
  - "A new issue is created" (fires once per unique error)
  - "An issue changes state from resolved to unresolved" (fires on regressions)
  - "The issue is seen more than N times in M minutes" (fires on frequency threshold)
- **IF:** "The event's tags match" → key: `feature`, match: `contains`, value: `<feature_tag>`
- **THEN:** "Send a notification via webhooks" → select the **Devin** integration
- **Action interval:** 5 minutes (default)
- **Name:** `<Feature Name> Error → Devin`

### Step 4 — Test the pipeline

1. Trigger the error in the app
2. Confirm the issue appears in Sentry with the correct `feature` tag
3. Wait for the alert to fire (up to 5 minutes depending on action interval)
4. Verify the webhook service received the call: `curl https://app-ixyrbrvl.fly.dev/healthz`
5. Check that a Devin session was created at `https://visaworkshop.devinenterprise.com/sessions/`

### Step 5 — Commit and push

Commit the instrumentation code changes to a feature branch and create a PR against `master`.

## Procedure: Modifying an Existing Alert

1. Navigate to `https://none-b41.sentry.io/alerts/rules/` and find the rule to edit
2. Click the rule name → **Edit Rule**
3. Modify the conditions (WHEN/IF/THEN), tag filters, or action interval as needed
4. Save the rule
5. If you changed the tag value, update the corresponding `Sentry.captureException()` call in the app code to match

## Re-triggering Alerts for Testing

The "new issue created" condition only fires once per unique issue. To re-test:
1. Go to the issue in Sentry → click **Resolve**
2. Trigger the error again in the app — Sentry treats it as a regression and fires the alert

Alternatively, use "An issue changes state from resolved to unresolved" as the trigger condition, which fires on every regression.

## Production Setup

To make alerts fire only on the deployed production app (not localhost/development):

1. **Environment is already tracked.** The Sentry SDK in `src/sentry.ts` sets `environment: process.env.NODE_ENV`, which is `development` locally and `production` when the app is built and deployed.

2. **Add an environment filter to the alert rule.** In the Sentry alert rule editor, add an additional IF condition: "The event's environment is `production`". This ensures alerts only fire for errors from the deployed app.

3. **Deploy the React app.** Build with `yarn build` and deploy the `build/` folder to any static hosting (Vercel, Netlify, Fly.io, S3+CloudFront, etc.). The production build automatically sets `NODE_ENV=production`, so Sentry events will have `environment: production`.

4. **Webhook service is already production-ready.** The webhook at `https://app-ixyrbrvl.fly.dev/webhook/sentry` is publicly accessible and will handle alerts from any environment. No changes needed.

## Do Not

- Modify the webhook service code or redeploy it unless explicitly asked
- Change the Sentry DSN in `src/sentry.ts`
- Delete existing alert rules without user confirmation
- Hardcode Sentry credentials — use temporary session secrets via `request_secret`
