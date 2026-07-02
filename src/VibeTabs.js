Popzy.elements = [];

function Popzy(options) {
    const defaults = {
        closeMethods: ["overlay", "button", "escape"],
        scrollLockTarget: () => document.body,
        enableScrollLock: true,
        destroyOnClose: true,
        cssClasses: [],
        footer: false,
    };
    Object.assign(this, defaults, options);

    if (!this.templateId && !this.content) {
        console.error(`At least 'content' or 'templateId' must be provided!`);
        return;
    }
    if (this.templateId && this.content) {
        this.templateId = null;
        console.warn(
            "Both content and templateId are specified, now content will take precedence, and templateId will be ignored.",
        );
    }
    if (this.templateId) {
        this.template = document.querySelector(`#${this.templateId}`);
        if (!this.template) {
            console.error(`Template with ${this.templateId} does not exists`);
            return;
        }
    }

    this._allowButtonClose = this.closeMethods.includes("button");
    this._allowBackdropClose = this.closeMethods.includes("overlay");
    this._allowEscapeClose = this.closeMethods.includes("escape");
    this._pendingFooterBtns = [];
    this._modalContent;
    this._backdrop;

    // binding
    this._closeByESC = this._closeByESC.bind(this);
}

// utility functions
Popzy.prototype._getScrollbarWidth = function () {
    if (this._scrollbarWidth) return this._scrollbarWidth;
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        overflow: "scroll",
        top: -2000,
        left: -2000,
    });
    document.body.appendChild(box);
    this._scrollbarWidth = box.offsetWidth - box.clientWidth;
    document.body.removeChild(box);
    return this._scrollbarWidth;
};

Popzy.prototype._closeByESC = function (event) {
    if (event.key === "Escape" && Popzy.elements.at(-1) === this) this.close();
};

Popzy.prototype._createButton = function (content, cssClasses, callBack) {
    const btn = document.createElement("button");
    btn.className = cssClasses;
    btn.innerHTML = content;
    btn.onclick = callBack;
    return btn;
};

Popzy.prototype._renderFooterContent = function () {
    if (this._footerContent)
        this._footerContainer.innerHTML = this._footerContent;
};

Popzy.prototype._renderFooterButtons = function () {
    if (this._footerContainer) {
        this._pendingFooterBtns.forEach((btn) => {
            this._footerContainer.appendChild(btn);
        });
    }
};

Popzy.prototype.setContent = function (content) {
    this.content = content;
    this._modalContent.innerHTML = content;
};

Popzy.prototype._build = function () {
    // load elements
    let backdrop = document.createElement("div");
    this._backdrop = backdrop;
    backdrop.classList.add("popzy__backdrop");

    const container = document.createElement("div");
    container.classList.add("popzy__container");

    this._modalContent = document.createElement("div");
    this._modalContent.classList.add("popzy__content");
    let content;
    if (this.content) content = this.content;
    else if (this.templateId) content = this.template.content.cloneNode(true);
    this._modalContent.innerHTML = content;
    container.appendChild(this._modalContent);

    // add to DOM
    backdrop.appendChild(container);
    document.body.appendChild(backdrop);

    // add footer buttons
    if (this.footer) {
        this._footerContainer = document.createElement("div");
        this._footerContainer.classList.add("popzy__footer");
        this._renderFooterContent();
        container.appendChild(this._footerContainer);

        this._renderFooterButtons();
    }

    // add css classes
    this.cssClasses.forEach((className) => {
        if (typeof className === "string") container.classList.add(className);
    });

    // touch the overlay to close modal
    if (this._allowBackdropClose) {
        backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) this.close();
        });
    }

    // press ESC to close modal
    if (this._allowEscapeClose) {
        document.addEventListener("keydown", this._closeByESC);
    }

    // btnClose feature to close modal
    if (this._allowButtonClose) {
        const btnClose = this._createButton(`x`, "popzy__close", () => {
            this.close();
        });
        container.appendChild(btnClose);
    }
};

Popzy.prototype.addFooterButton = function (content, cssClasses, callBack) {
    const btn = this._createButton(content, cssClasses, callBack);
    this._pendingFooterBtns.push(btn);

    this._renderFooterButtons();
};

Popzy.prototype.setFooterContent = function (html) {
    this._footerContent = html;
    this._renderFooterContent();
};

Popzy.prototype._hasScrollBar = function (element) {
    if (element === document.body || element === document.documentElement) {
        return document.documentElement.scrollHeight > window.innerHeight;
    }
    return element.scrollHeight > element.clientHeight;
};

Popzy.prototype.open = function () {
    Popzy.elements.push(this);

    // cases to create new modal
    if (!this._backdrop) {
        this._build();
    }

    // handle scroll lock
    if (this.enableScrollLock) {
        const target = this.scrollLockTarget();
        target.classList.add("popzy--no-scroll");
        const targetPaddingRight = parseInt(
            getComputedStyle(target).paddingRight,
        );
        if (this._hasScrollBar(target))
            target.style.paddingRight = `${this._getScrollbarWidth() + targetPaddingRight}px`;
    }

    // function to call when modal is opened
    this._onTransitionEnd(() => {
        if (typeof this.onOpen === "function") this.onOpen();
    });

    // show the modal
    setTimeout(() => {
        this._backdrop.classList.add("popzy--show");
    }, 0);
};

Popzy.prototype._onTransitionEnd = function (callBack) {
    this._backdrop.ontransitionend = (event) => {
        if (event.propertyName !== "scale") return;
        if (typeof callBack === "function") callBack();
    };
};

Popzy.prototype.close = function (destroy = this.destroyOnClose) {
    Popzy.elements.pop();

    this._backdrop.classList.remove("popzy--show");

    this._onTransitionEnd(() => {
        if (destroy && this._backdrop) {
            this._backdrop.remove();
            this._backdrop = null;
        }

        if (typeof this.onClose === "function") this.onClose();
    });

    document.removeEventListener("keydown", this._closeByESC);

    if (!Popzy.elements.length && this.enableScrollLock) {
        const target = this.scrollLockTarget();
        target.classList.remove("popzy--no-scroll");
        target.style.paddingRight = "";
    }
};

Popzy.prototype.destroy = function () {
    this.close(true);
};
