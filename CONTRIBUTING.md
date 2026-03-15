# Contributing

## Development Setup

```bash
cd sip-app
npm install
npm run dev
```

## Coding Standards

- TypeScript strict mode
- ESLint (`npm run lint`)
- All new components must have ARIA labels
- Run `npm test` before submitting

## Compliance Rules

- Never add scheme names or product recommendations
- Never remove or modify the disclaimer text in `src/lib/disclaimer.ts`
- All return/inflation assumptions must remain user-editable

## Pull Request Checklist

- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] Disclaimer visible on all result screens
- [ ] Accessibility tested (keyboard nav, screen reader)
