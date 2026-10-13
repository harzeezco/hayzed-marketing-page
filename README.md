# Hayzed marketing page

Customer-first landing page for Lagos market research, built with Next.js, TypeScript, and Tailwind CSS. The buyer form can save each verified submission as one row in a private Google Sheet through a server route and a Google Apps Script receiver.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. Check changes with `npm run lint`, `npm run typecheck`, and `npm run build`.

## Connect the Google Sheet

1. Open the private [Hayzed — early access responses](https://docs.google.com/spreadsheets/d/10v5MXRDnjfj_8OeXevcv-g5V46gk1xX9cojGQckPKPA/edit) Google Sheet. Its spreadsheet ID is `10v5MXRDnjfj_8OeXevcv-g5V46gk1xX9cojGQckPKPA`. Do not publish it on the web.
2. In that Sheet, choose **Extensions → Apps Script**. Replace the default code with [integrations/google-sheets.gs](integrations/google-sheets.gs).
3. In Apps Script **Project Settings → Script Properties**, add `HAYZED_SPREADSHEET_ID` with `10v5MXRDnjfj_8OeXevcv-g5V46gk1xX9cojGQckPKPA` and `HAYZED_SHARED_SECRET` with the value already generated in the site's private `.env.local` file. Keep the secret private.
4. Deploy the script as a **Web app**, running as **Me**, with access **Anyone**. The Sheet stays private; the web app rejects requests without the shared secret. Copy the deployed `/exec` URL.
5. Set `GOOGLE_SHEETS_WEB_APP_URL` in the existing `.env.local` file to the deployed `/exec` URL. Leave its generated `GOOGLE_SHEETS_SHARED_SECRET` value intact. Add `NEXT_PUBLIC_WHATSAPP_NUMBER` only if you want the WhatsApp link. Restart the dev server.
6. Confirm `GET /api/early-access` returns `{"ready":true}`. Submit one clearly labeled test entry through the form, confirm it appears in the `Early access` tab, then delete the test row.

The form checks readiness on load. When the receiver is not configured, it explains that signups are unavailable and disables submission. The server validates all fields and consent and reports success only after the receiver confirms a saved row. Customer details and the shared secret never belong in `NEXT_PUBLIC_*` variables.

For deployment, use a host that runs Next.js server routes and set the same private environment variables there. Static hosting cannot run the submission route. Before a public launch, add durable abuse protection and review data retention and the privacy notice.

## Editing

- `src/lib/content.ts`: brand copy and WhatsApp number.
- `src/app/page.tsx`: page sections and calls to action.
- `src/app/globals.css`: colors and responsive layout.
- `src/components/InterestForm.tsx`: buyer fields and form states.
- `src/app/api/early-access/route.ts`: validation and secure receiver call.
- `integrations/google-sheets.gs`: Google Sheet row mapping.

The browser emits analytics event names through `hayzed:analytics`; no analytics service is installed. There is no catalogue, checkout, payment flow, or merchant dashboard.
