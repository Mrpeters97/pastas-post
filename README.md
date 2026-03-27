# 🐱 Pastas Post - Daily Pet Update Webapp

Een mobile-first webapp voor het dagelijks delen van foto's en verhalen over je kat met vrienden.

## ✨ Features

### Home Pagina
- **Upload Scherm**: Dagelijks een foto en verhaal uploaden
- **Post Weergave**: Foto + verhaal weergeven met flip animatie
- **Placeholder**: Wanneer er nog geen post is voor vandaag
- **Auto-reset**: Automatisch reset naar lege staat op een nieuwe dag

### Postkamer (Archief)
- **30-daags Archief**: Alle posts van de afgelopen 30 dagen bekijken
- **Grid Layout**: 3 kolommen x 5 rijen per pagina (15 items)
- **Swipeable Pagina's**: Links/rechts swipen om door pagina's te navigeren
- **Detail View**: Klik op een foto om het volledige verhaal te lezen in een modal
- **Flip Animatie**: Ook in het archief flip-animatie voor verhalen

### Navigatie
- **Sticky Navbar**: Permanente navigatie aan de onderkant
- **Home/Postkamer Links**: Eenvoudig navigeren tussen pagina's

## 🚀 Hoe Gebruikt

### Setup
1. Open `index.html` in een moderne webbrowser (Chrome, Safari, Firefox, Edge)
2. De webapp werkt volledig met localStorage - geen server nodig

### Modi

#### Uploader Modus (Voor Jou)
- Open: `index.html` of `index.html?mode=upload`
- Je kunt dagelijks foto's en verhalen uploaden

#### Viewer Modus (Voor Je Vriend)
- Open: `index.html?mode=view`
- Je vriend kan alleen posts bekijken
- Upload formulier is verborgen

### Upload (Uploader Modus)
1. Ga naar Home pagina
2. Klik op "Foto uploaden" en selecteer een afbeelding
3. Schrijf je verhaal over de dag
4. Klik "Post verzenden"
5. De post wordt opgeslagen en verschijnt onmiddellijk

### Bekijken (Viewer Modus)
1. Ga naar Home pagina om de huidge post te zien
2. Klik op het flip-icoon rechtsonder om het verhaal te lezen
3. Ga naar Postkamer om alle vorige posts te bekijken
4. Swipe of gebruik de pijlknoppen om door de pagina's te navigeren
5. Klik op een foto om het volledige verhaal in een modal te zien

## 📱 Browser Ondersteuning

- Chrome (v60+)
- Safari (v12+)
- Firefox (v55+)
- Edge (v79+)
- Gemaakt voor mobiel - **niet** responsief voor desktop

## 🎨 Styling

### Kleurschema
- **Achtergrond**: `#000000` (Zwart)
- **Accent**: `#FFFDA3` (Geel)
- **Cards**: `#21211F` (Dark Gray)
- **Text**: `#FFFFFF` (Wit)

### Fonts
- **Body/Navbar**: Be Vietnam (Google Fonts)
- **Titels**: PP Gatwick (Lokaal)

## 💾 Data Opslag

- **Locatie**: Browser localStorage
- **Format**: JSON met datum als key (YYYY-MM-DD)
- **Persistentie**: Blijft behouden tot browser cache wordt geleegd
- **Backup**: Gegevens worden niet gesynchroniseerd naar server (lokaal alleen)

## 🔄 Automatische Dagelijkse Reset

De webapp controleert automatisch of er een nieuwe dag is aangebroken en:
- Reset de Home pagina naar lege staat
- Verplaatst gisteren's post naar het archief
- Maakt veld klaar voor vandaag's update

## ⌨️ Keyboard Shortcuts (Op Desktop)

- `←` / `→`: Pagina's in Postkamer navigeren (als met keyboard)
- `Esc`: Modal/Popover sluiten

## 🛠️ Technologie

- Pure HTML5, CSS3, JavaScript (geen frameworks)
- LocalStorage API voor persistentie
- CSS 3D Transforms voor flip-animatie
- Touch Events voor swipe-funcionaliteit
- Responsive Design voor mobiel

## 📝 Notities

- De app werkt **100% offline** - geen internetverbinding nodig
- Alle gegevens blijven lokaal op je apparaat
- Werkt op telefoon, tablet, maar scherm is geoptimaliseerd voor mobiel
- Foto's worden geconverteerd naar base64 en opgeslagen in localStorage

## 🎯 Toekomstige Verbeteringen (Optioneel)

- Backend integratie voor cloud sync
- Notificaties voor nieuwe posts
- Delen van posts via WhatsApp/Email
- Donkere/lichte thema toggle
- Multi-taal ondersteuning
