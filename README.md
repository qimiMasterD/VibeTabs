# VibeTabs.js

> A lightweight, dependency-free JavaScript tabs library with URL state persistence.

VibeTabs.js makes it easy to create clean, responsive tab interfaces without any frameworks. It automatically manages active states, optionally remembers the selected tab using URL query parameters, and provides a simple callback API for custom behaviors.

---

## Features

- 🚀 Zero dependencies
- 🎯 Simple initialization
- 🔗 Optional URL state persistence
- 🎨 Fully customizable active class
- ⚡ Callback hook when tabs change
- 🧹 Clean `.destroy()` method
- 📱 Works with any HTML layout
- 💾 Tiny and framework independent

---

## Installation

### Option 1 — Download

Download the latest release and include the files:

```html
<link rel="stylesheet" href="./src/VibeTabs.css">
<script src="./src/VibeTabs.js"></script>
```

---

### Option 2 — jsDelivr CDN

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/qimiMasterD/VibeTabs@1.0.0/VibeTabs.min.css">

<script src="https://cdn.jsdelivr.net/gh/qimiMasterD/VibeTabs@1.0.0/VibeTabs.min.js"></script>
```

---

## Basic Usage

### HTML

```html
<ul id="tabs">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
</ul>

<div id="home">
    Home content
</div>

<div id="about">
    About content
</div>

<div id="contact">
    Contact content
</div>
```

### JavaScript

```javascript
const tabs = new VibeTabs("#tabs");
```

That's all.

---

# Browser Support

Supports all modern browsers that implement:

- ES6
- `classList`
- `URLSearchParams`
- `history.replaceState`

---

# Project Structure

```
VibeTabs/
│
├── src/
│   ├── VibeTabs.js
│   └── VibeTabs.css
│
├── assets/
│
├── index.html
│
└── README.md
```

---

# Author

Created by **qimiMasterD**.

GitHub:
https://github.com/qimiMasterD/VibeTabs
