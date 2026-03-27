# 🐱 Pastas Post - Dagelijks Foto Uploaden via VSCode

Sinds de webapp geen upload formulier meer heeft, kun je foto's op de volgende manier toevoegen:

## 📸 Methode 1: Via `data-manager.js` (Aanbevolen)

### Stap 1: Foto naar Base64 Converteren

Gebruik deze online tool: [base64.guru/converter/encode/image](https://base64.guru/converter/encode/image)

1. Ga naar de converter website
2. Upload je foto
3. Kopieer de volledige Base64 string (inclusief `data:image/...;base64,` prefix)

**Of lokaal in Terminal:**
```bash
# Mac/Linux - encode image to base64
base64 -i path/to/your/photo.jpg
```

### Stap 2: Data Manager Updaten

Open `data-manager.js` en voeg je post toe aan het `postsData` object:

```javascript
const postsData = {
    "2026-03-25": {
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...[PLAATS HIER JE BASE64]...",
        "story": "Vandaag was Pasta erg speels! Ze heeft de hele dag met haar speeltjes gespeeld."
    },
    "2026-03-24": {
        "photo": "data:image/jpg;base64,/9j/4AAQSkZJRg...",
        "story": "Een rustige dag. Pasta sliep veel."
    }
};
```

### Stap 3: Data Manager Uitvoeren

1. Open een Terminal in VSCode
2. Voer dit uit:
```bash
node data-manager.js
```

3. Je zult zien:
```
✅ Posts successfully added to localStorage!
Posts added: ['2026-03-25', '2026-03-24']
Total posts in storage: 2
```

### Stap 4: Webapp Openen

Open `index.html` in je browser en je posts zullen zichtbaar zijn!

---

## 📝 Dateformat Sysmteem

De datum moet in dit formaat zijn: **YYYY-MM-DD**

- `2026-03-25` = 25 maart 2026
- `2026-01-15` = 15 januari 2026
- Altijd 4-digit jaar, 2-digit maand, 2-digit dag

---

## 🎯 Stap-voor-stap Voorbeeld

### Je hebt vandaag deze foto gemaakt:

1. **Converteer naar Base64:**
   - Open https://base64.guru/converter/encode/image
   - Upload je foto van Pasta
   - Kopieer alle tekst (heel lang!)

2. **Update data-manager.js:**
```javascript
const postsData = {
    "2026-03-25": {
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...... [JOUW BASE64 HIER] ......",
        "story": "Vandaag was Pasta super leuk! Ze sprong overal rond en speelde met haar favoriete bal."
    }
};
```

3. **Run in Terminal:**
```bash
node data-manager.js
```

4. **Open webapp:**
   - Open `index.html` in browser
   - Home pagina toont je foto + verhaal
   - Flip-knop om het verhaal te lezen

---

## 💻 Data Manager Commando's

Je kunt ook commando's gebruiken in developer console:

```javascript
// Voeg posts toe
addPostsToLocalStorage()

// Bekijk alle opgeslagen posts
viewStoredPosts()

// Verwijder specifieke post
deletePost("2026-03-25")

// Verwijder alles (voorzichtig!)
clearAllPosts()
```

---

## 🔄 Handige Browser Console Methode

Je kunt ook direct in de browser console werken:

1. Open `index.html`
2. Druk F12 om Developer Tools te openen
3. Ga naar Console tabblad
4. Voer in:

```javascript
// Voeg een post direct toe:
const posts = JSON.parse(localStorage.getItem('pastas_posts') || '{}');
posts['2026-03-25'] = {
    photo: "data:image/jpeg;base64,YOUR_BASE64_HERE",
    story: "Je verhaal hier"
};
localStorage.setItem('pastas_posts', JSON.stringify(posts));
location.reload(); // Refresh pagina
```

---

## 🛠️ Troubleshooting

### Foto toont niet
- Zorg dat Base64 string compleet is (inclusief `data:image/...;base64,`)
- Check dat je geen komma's bent vergeten in de JSON

### "SyntaxError: Unexpected token"
- Je data-manager.js syntax klopt niet
- Controleer alle aanhalingstekens en komma's
- Probeer in VSCode JSON formatter

### Posts voegen niet toe
- Check dat Node.js geïnstalleerd is (`node --version`)
- Zorg dat je in de juiste directory bent
- Check console output voor errors

---

## 📱 Best Practice

1. **Dagelijks updaten:**
   - Neem foto
   - Converteer naar Base64
   - Voeg toe aan data-manager.js
   - Run en refresh webapp

2. **Meerdere foto's tegelijk:**
   - Voeg alles toe aan postsData object
   - Run eenmalig data-manager.js
   - Alles wordt opgeslagen

3. **Backup maken:**
   ```javascript
   // Console commando - kopieert alle posts
   JSON.stringify(JSON.parse(localStorage.getItem('pastas_posts')), null, 2)
   ```

---

## ✅ Checklist voor Daily Updates

- [ ] Foto van Pasta genomen
- [ ] Foto geconverteerd naar Base64
- [ ] Entry toegevoegd aan data-manager.js met correct datum format (YYYY-MM-DD)
- [ ] Verhaal geschreven
- [ ] `node data-manager.js` uitgevoerd
- [ ] output check: "✅ Posts successfully added"
- [ ] Webapp geopend en foto zichtbaar
- [ ] Flip-knop test - verhaal toont

---

## 💡 Pro Tips

**Foto compressie:** Voor kleinere file sizes:
```bash
# Convert en compress (Mac/Linux)
sips -s format jpeg -Z 800 photo.png > photo-small.jpg
```

**Batch converteren:** Meerdere foto's tegelijk:
```bash
for f in *.jpg; do
    echo "$(base64 -i "$f")" >> output.txt
done
```

**VS Code extensie:** Installeer "Base64" extension voor gemakkelijk converteren in editor.

---

Veel plezier met je dagelijkse updates! 🎉
