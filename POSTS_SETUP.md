# Posts Structure & Loading Guide

## 📁 Mappenstructuur

Elke dag een aparte map met datumformaat `YYYY-MM-DD`:

```
posts/
├── 2026-03-25/
│   ├── photo.jpg
│   └── story.txt
├── 2026-03-26/
│   ├── photo.jpg
│   └── story.txt
├── 2026-03-27/
│   ├── photo.jpg
│   └── story.txt
└── ... en zo verder
```

### Bestandsnamen

- **Foto**: `photo.jpg` (of `.png`, `.jpeg`)
- **Verhaal**: `story.txt`
- **Map naam**: `YYYY-MM-DD` (bijv. `2026-03-25`)

## 🔧 Posts Laden

### Stap 1: Maak dagmappen aan
Voor elke dag waarvan je een post wilt toevoegen:

```
posts/2026-03-25/
posts/2026-03-26/
posts/2026-03-27/
```

### Stap 2: Voeg bestanden toe
In elke dagmap:
```
posts/2026-03-25/
├── photo.jpg
└── story.txt
```

### Stap 3: Run het load-posts script
```bash
node load-posts.js
```

Dit zal alle posts scannen en de output geven.

### Stap 4: Voeg in localStorage in
Het script geeft je een console-commando. Open je browser console (F12) en plak:

```javascript
localStorage.setItem('pastas_posts', '{"2026-03-25":{"photo":"data:image/jpeg;base64,...","story":"Jouw verhaal hier...","date":"2026-03-25T00:00:00.000Z"}}')
```

### Stap 5: Reload je webapp
Refresh de browser en je posts verschijnen! 🎉

## 📝 Notities

- **Zowel** foto EN verhaal moeten aanwezig zijn voor een volledige post
- Ontbrekende bestanden worden genegeerd met een waarschuwing
- De mamnaam MOET `YYYY-MM-DD` format zijn (bijv. `2026-03-25`)
- Foto-extensies: `.jpg`, `.png`, `.jpeg`
- Verhaal moet een `.txt` bestand zijn (gewoon tekst)

## 🎯 Workflow voor je vriend

**Elke dag:**
1. Maak een nieuwe map aan: `posts/2026-03-25/`
2. Upload een foto: `posts/2026-03-25/photo.jpg`
3. Schrijf het verhaal: `posts/2026-03-25/story.txt`
4. Run in terminal: `node load-posts.js`
5. Copy-paste de localStorage command in browser console
6. Refresh de webapp → ✨ Klaar!

## 📦 Complete voorbeeld

```bash
posts/
├── 2026-03-25/
│   ├── photo.jpg              ← Foto van Pastas
│   └── story.txt              ← "Vandaag was een mooie dag..."
├── 2026-03-26/
│   ├── photo.jpg
│   └── story.txt
└── 2026-03-27/
    ├── photo.jpg
    └── story.txt
```

Dan run je: `node load-posts.js` → en alle 3 posts worden geladen! 🐱
