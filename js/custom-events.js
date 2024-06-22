class CustomEventInfo {
    #eventName = '';

    constructor(eventName, option, detail) {
        this.#eventName = eventName;
        this.option = option;
        this.detail = detail;
    }

    get eventName() {
        return this.#eventName;
    }

    set eventDetail(detailObjLiteral) {
        this.detail = detailObjLiteral;
    }

    get eventDetail() {
        return this.detail;
    }

    set eventOption(optionObjLiteral) {
        this.option = optionObjLiteral;
    }

    get eventOption() {
        return this.option;
    }

    getEventObj() {
        if (!this.option) {
            return new CustomEvent(this.#eventName, {detail: this.detail});
        }
        if (this.detail) {
            this.option.detail = this.detail;
        }
        return new CustomEvent(this.#eventName, this.option);
    }
}

export const customEventsInfo = {
    "empty-document": new CustomEventInfo("empty-document"),
    "current-tab-storage": new CustomEventInfo("current-tab-storage"),
    "config-icon-click": new CustomEventInfo("config-icon-click"),
    "image-container-click": new CustomEventInfo("image-container-click"),
};
