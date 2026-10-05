Yes. If your goal is simply:

**HTML + CSS + JavaScript game → Windows `.exe`**

then Electron is actually more than you need. There are several lighter alternatives.

### Best options for your game

| Option            | Converts to `.exe` |          Size | Difficulty | Best for                  |
| ----------------- | -----------------: | ------------: | ---------: | ------------------------- |
| **Tauri**         |                  ✅ |      🟢 Small |     Medium | Modern web apps/games     |
| **Neutralinojs**  |                  ✅ | 🟢 Very small |       Easy | Simple HTML/JS apps       |
| **NW.js**         |                  ✅ |     🟡 Medium |       Easy | Web apps needing Chromium |
| **WebView2 + C#** |                  ✅ |      🟢 Small |     Medium | Windows-only games        |
| **Electron**      |                  ✅ |      🔴 Large |       Easy | Full desktop apps         |

### ⭐ I'd recommend **Tauri** for your game

Your game is already HTML/CSS/JS, so the basic structure is essentially:

```text
Your Game
│
├── index.html
├── style.css
├── game.js
├── assets/
└── ...
```

Tauri can wrap that into:

```text
Spin Go.exe
```

without requiring you to run a local server.

It uses the **Windows WebView2** engine rather than shipping an entire Chromium browser with every app.

So compared with Electron:

```text
Electron
Your Game
   +
Chromium
   +
Node.js
   ↓
large .exe
```

while Tauri is roughly:

```text
Tauri
Your Game
   +
Windows WebView2
   ↓
small .exe
```

### Even simpler: Neutralinojs

For your particular game, **Neutralinojs is worth looking at** because you don't seem to need Node.js APIs or a complicated desktop backend.

Your game could remain almost completely unchanged:

```text
index.html
game.js
style.css
assets/
```

and Neutralino packages it as a Windows application.

---

### One important thing for your situation

You previously ran into this:

```text
Access to script at 'file:///D:/Projects/...'
```

That is because browsers impose restrictions when you directly open an HTML application using:

```text
file:///
```

A desktop wrapper such as **Tauri / Neutralino / Electron** solves this by providing the application's web environment properly.

So you **don't need to host your game on a server**.

For example:

```text
npm run build
       ↓
dist/
       ↓
Tauri / Neutralino
       ↓
Spin-Go.exe
       ↓
Double-click
       ↓
Game starts
```

### My recommendation for your case

Since you're making a relatively lightweight **retro HTML/JS game**, I'd rank them:

**1. Tauri ⭐⭐⭐⭐⭐**
Best overall choice.

**2. Neutralinojs ⭐⭐⭐⭐**
If you want the absolute simplest/lightweight wrapper.

**3. Electron ⭐⭐⭐**
Works very well, but considerably heavier than necessary for a small game.

If your main concern is **"I just want to take my existing HTML game and get a portable Windows `.exe` with the least amount of work"**, I'd go with **Tauri or Neutralino**, rather than fighting Electron.
