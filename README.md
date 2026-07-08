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

# Configuration

```javascript
const tabs = new VibeTabs("#tabs", {
    remember: true,
    activeTabClass: "my-active-tab",

    onChange(event) {
        console.log(event.tab);
        console.log(event.panel);
    }
});
```

---

## Options

| Option | Type | Default | Description |
|---------|------|---------|-------------|
| `remember` | `Boolean` | `false` | Saves the selected tab in the URL query string. |
| `activeTabClass` | `String` | `"VibeTabs--active"` | CSS class applied to the active `<li>`. |
| `onChange` | `Function \| null` | `null` | Callback fired whenever the active tab changes. |

---

## URL Persistence

When `remember` is enabled, VibeTabs automatically stores the current tab inside the URL.

For example:

```
https://example.com/?demo1=tab2
```

Refreshing the page restores the previous tab automatically.

Each VibeTabs instance uses its selector as the query key, allowing multiple independent tab groups on the same page.

Example:

```
?demo1=tab2&demo2=analytics
```

---

# onChange Callback

The callback receives an event object.

```javascript
const tabs = new VibeTabs("#tabs", {
    onChange(event) {
        console.log(event.tab);
        console.log(event.panel);
    }
});
```

### Event Object

| Property | Description |
|----------|-------------|
| `event.tab` | The clicked `<a>` element |
| `event.panel` | The activated content panel |

Example:

```javascript
onChange(event) {
    console.log(event.tab.getAttribute("href"));
}
```

---

# Public API

## switch()

Programmatically activate a tab.

By id:

```javascript
tabs.switch("#about");
```

Using an anchor element:

```javascript
tabs.switch(document.querySelector('a[href="#about"]'));
```

Prevent updating the URL:

```javascript
tabs.switch("#about", false);
```

---

## destroy()

Completely removes the VibeTabs instance.

```javascript
tabs.destroy();
```

This method:

- removes all event listeners
- restores the original HTML
- restores panel visibility
- clears internal references

---

# Demo Examples

## Basic Tabs

```javascript
new VibeTabs("#demo1");
```

---

## Remember Active Tab

```javascript
new VibeTabs("#demo1", {
    remember: true
});
```

---

## Custom Active Class

```javascript
new VibeTabs("#demo1", {
    activeTabClass: "demo-active"
});
```

---

## Callback

```javascript
new VibeTabs("#demo2", {
    onChange(event) {
        console.log(event.panel);
    }
});
```

---

## Sliding Indicator

```javascript
function slideTab(event) {
    const index = this.panels.indexOf(event.panel);

    const line = document.querySelector("#demo3 + .active-line");

    line.style.width = `${this.tabChilds[index].offsetWidth}px`;
    line.style.transform =
        `translateX(${this.tabChilds[index].offsetLeft}px)`;
}

const tabs = new VibeTabs("#demo3", {
    onChange: slideTab
});

slideTab.call(tabs, {
    panel: tabs.panels[tabs.activeTabIndex]
});
```

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

# License

MIT License.

---

# Author

Created by **qimiMasterD**.

GitHub:
https://github.com/qimiMasterD/VibeTabs
