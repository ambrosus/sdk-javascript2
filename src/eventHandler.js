/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

/**
 * Event Handler Methods.
 *
 * @class
 */
class EventHandler {
    constructor() {
        this.events = {};
        this.empty = [];
    }
    /**
     * Subscribe to an event.
     *
     * @param {any} type
     * @param {any} func
     * @param {any} ctx
     */
    on(type, func, ctx) {
        /* istanbul ignore next */
        (this.events[type] = this.events[type] || []).push([func, ctx]);
        /* istanbul ignore next */
        return this;
    }

    /**
     * Unsubscribe from a global event.
     *
     * @param {any} type
     * @param {any} func
     */
    off(type, func) {
        /* istanbul ignore next */
        type || (this.events = {});
        /* istanbul ignore next */
        let list = this.events[type] || this.empty;
        /* istanbul ignore next */
        let i = (list.length = func ? list.length : 0);

        /* istanbul ignore next */
        while (i--) {
            func === list[i][0] && list.splice(i, 1);
        }
        /* istanbul ignore next */
        return this;
    }

    /**
     * Emit a global event
     *
     * @param {any} type
     */
    emit(type) {
        /* istanbul ignore next */
        let e = this.events[type] || this.empty;
        /* istanbul ignore next */
        let list = e.length > 0 ? e.slice(0, e.length) : e;
        let i = 0;
        let j;

        /* istanbul ignore next */
        while ((j = list[i++])) {
            j[0].apply(j[1], this.empty.slice.call(arguments, 1));
        }
        /* istanbul ignore next */
        return this;
    }
}

export default EventHandler;
