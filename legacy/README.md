# Legacy Payload → Sanity migration

`migrate-to-sanity.ts` reads all content from the old Payload/Postgres setup and
writes it to Sanity. Run it from a **checkout of the last Payload-era commit**
(where `payload`, `src/collections`, and `src/payload.config.ts` still exist),
with this script copied in:

```bash
# In a worktree/checkout of the last Payload commit (main before the Sanity merge):
NEXT_PUBLIC_SANITY_PROJECT_ID=<id> \
NEXT_PUBLIC_SANITY_DATASET=production \
SANITY_API_WRITE_TOKEN=<token> \
npx tsx ./migrate-to-sanity.ts
```

It is idempotent (`createOrReplace` with deterministic IDs), so it can be
re-run safely.
