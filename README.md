# Lumsås Petanque Klub (Lokal Version)

Denne version kører 100% lokalt med:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite

Fokus: medlemmer, login og tilmelding til spilledage.

## Kom i gang
1. Installer:
```bash
npm i
```

2. Opret env:
```bash
cp .env.example .env.local
```

3. Opret lokal database:
```bash
npm run db:push
```

4. Start:
```bash
npm run dev
```

Åbn: `http://localhost:3000`

## Login og medlemmer
- Gå til `/login`
- `Opret medlem`
- Første oprettede bruger bliver automatisk `admin`
- Derefter kan admin styre spilledage på `/dashboard/admin`
- Medlem kan skifte eget kodeord på `/dashboard`
- Admin kan nulstille medlems kodeord på `/dashboard/admin`

## Spilledage
- Medlemmer tilmelder sig på `/dashboard/spilledage`
- Status: `Kommer`, `Måske`, `Kommer ikke`
- En tilmelding pr. medlem pr. spilledag (unik constraint)

## Assets
Læg billeder i `public/images`:
- `Final logo.png`
- `hero.jpg`
- `spilletider.jpg`

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run db:push`
- `npm run db:studio`
