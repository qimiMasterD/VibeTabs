function VibeTabs(selector, options) {
    const defaults = {
        activeTabClass: "VibeTabs--active",
        remember: false,
        onChange: null,
    };
    Object.assign(this, defaults, options);

    this.selector = this._removeCharacters(selector);
    this.tabParent = document.querySelector(selector);
    if (!this.tabParent) {
        console.error(`VibeTabs: No container found for selector ${selector}`);
        return;
    }
    this.originalHTML = this.tabParent.innerHTML;

    this.tabChilds = this.tabParent.children;

    if (this.tabChilds.length === 0) {
        console.error("VibeTabs: No tabs found inside the parent container");
        return;
    }

    this.activeTabIndex = 0;
    this.tabTargets = [];
    this.panels = [];
    for (let i = 0; i < this.tabChilds.length; i++) {
        if (this.tabChilds[i].classList.contains(this.activeTabClass))
            this.activeTabIndex = i;
        const aTag = this.tabChilds[i].querySelector("a");
        const target = aTag.getAttribute("href");
        aTag.onclick = (event) => {
            event.preventDefault();
            this.switch(target);
        };
        const panel = document.querySelector(target);
        if (!panel) {
            console.error(`VibeTabs: No panel found for selector ${target}`);
            return;
        }
        this.panels.push(panel);
        this.tabTargets.push(target);
    }

    const searchParams = new URLSearchParams(location.search);
    const savedTabIndex = searchParams.get(this.selector);
    if (this.remember && savedTabIndex)
        this.activeTabIndex = this.tabTargets.findIndex((element) => {
            return this._removeCharacters(element) === savedTabIndex;
        });
    if (this.activeTabIndex === -1) this.activeTabIndex = 0;
    this.switch(this.tabTargets[this.activeTabIndex], false);
}

// Remove insufficient characters
VibeTabs.prototype._removeCharacters = function (input) {
    return input.replace(/[^a-zA-Z0-9]/g, "");
};

// Open and close tab with index
VibeTabs.prototype._setTab = function (index) {
    this.tabChilds[index].classList.add(this.activeTabClass);
    this.panels[index].classList.remove("VibeTabs--hidden");
};

VibeTabs.prototype._removeTab = function (index) {
    this.tabChilds[index].classList.remove(this.activeTabClass);
    this.panels[index].classList.add("VibeTabs--hidden");
};

VibeTabs.prototype._setParameters = function (key, value) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    if (this.remember)
        history.replaceState(null, null, `?${searchParams.toString()}`);
};

// switch a tab with the 'selector' provided
VibeTabs.prototype.switch = function (input, updateURL = true) {
    let idx;
    if (typeof input !== "string") {
        idx = Array.from(this.tabChilds).findIndex((element) => {
            return element === input.closest("li");
        });
    } else idx = this.tabTargets.indexOf(input);
    if (idx === -1) {
        console.error(`VibeTabs: Cannot switch, input invalid!`);
        return;
    }
    if (this.activeTabIndex !== idx && typeof this.onChange === "function") {
        this.onChange({
            tab: this.tabChilds[idx].querySelector("a"),
            panel: this.panels[idx],
        });
    }
    for (let i = 0; i < this.tabChilds.length; i++)
        if (i === idx) this._setTab(i);
        else this._removeTab(i);
    this.activeTabIndex = idx;
    if (updateURL)
        this._setParameters(
            this.selector,
            this._removeCharacters(this.tabTargets[idx]),
        );
};

VibeTabs.prototype.destroy = function () {
    this.tabParent.innerHTML = this.originalHTML;
    for (let panel of this.panels) panel.classList.remove("VibeTabs--hidden");
    this.activeTabIndex = null;
    this.selector = null;
    this.tabParent = null;
    this.tabChilds = null;
    this.tabTargets = null;
    this.panels = null;
};
