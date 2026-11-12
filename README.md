# Rare Crew Angular

Table of employees ordered by total time worked (rows under 100 h highlighted) and a pie chart
with each employee's percentage of the total time worked (Chart.js).

## Run

```bash
npm install
npm start
```

Open http://localhost:4200.

During development, requests to `/api` are forwarded to
`https://rc-vault-fap-live-1.azurewebsites.net` by the Angular dev server (`proxy.conf.json`),
so the browser does not run into CORS restrictions.
