# Primary Monitor Alt+Tab

A GNOME Shell extension that hides windows on secondary monitors from the
Alt+Tab switcher, so it only lists windows on your primary monitor.

It applies to both the application switcher and the window switcher. If the
focused window is on a secondary monitor, the switcher preselects the first
listed window instead of the second, since the focused window isn't in the list.

Nothing else in the shell is affected: the overview, the dock and other
extensions still see every window.

## Requirements

GNOME Shell 50.

## Installation

Clone the repository into your extensions directory. The directory name must
match the extension's UUID:

```sh
git clone https://github.com/sammyhenningsson/primary-monitor-alt-tab.git \
    ~/.local/share/gnome-shell/extensions/primary-monitor-alt-tab@local
```

Log out and back in so GNOME Shell picks up the new extension, then enable it:

```sh
gnome-extensions enable primary-monitor-alt-tab@local
```

## Usage

There is nothing to configure. The primary monitor is the one set under
Settings → Displays.

## License

[MIT](LICENSE)
