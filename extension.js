import Meta from 'gi://Meta';

import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as AltTab from 'resource:///org/gnome/shell/ui/altTab.js';

const isOnPrimary = window =>
    window.get_monitor() === global.display.get_primary_monitor();

export default class PrimaryMonitorAltTab extends Extension {
    enable() {
        this._injections = new InjectionManager();

        // The switchers get their windows from a private function that calls
        // get_tab_list(), so filter that, but only while a switcher is being
        // built. Everything else in the shell still sees every window.
        let building = false;

        this._injections.overrideMethod(Meta.Display.prototype, 'get_tab_list',
            original => function (...args) {
                const windows = original.apply(this, args);
                return building ? windows.filter(isOnPrimary) : windows;
            });

        const whileBuilding = original => function (...args) {
            building = true;
            try {
                return original.apply(this, args);
            } finally {
                building = false;
            }
        };

        // The switchers preselect the second entry because the first is
        // normally the focused window. If focus is on a secondary monitor, the
        // focused window isn't listed, so the first entry is the right target.
        const selectFirstIfFocusHidden = original => function (backward, binding) {
            const focused = global.display.focus_window;

            if (backward || !focused || isOnPrimary(focused))
                original.call(this, backward, binding);
            else if (binding === 'switch-group')
                this._select(0, 0);
            else
                this._select(0);
        };

        for (const popup of [AltTab.AppSwitcherPopup, AltTab.WindowSwitcherPopup]) {
            this._injections.overrideMethod(popup.prototype, '_init', whileBuilding);
            this._injections.overrideMethod(popup.prototype, '_initialSelection',
                selectFirstIfFocusHidden);
        }
    }

    disable() {
        this._injections.clear();
        this._injections = null;
    }
}
