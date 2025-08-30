# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Visual Studio Code extension that provides HTML snippets for [DaisyUI components](https://daisyui.com/components/). The extension allows developers to quickly insert DaisyUI component templates using snippet prefixes that start with `d-`.

## Architecture

- **Extension Manifest**: `package.json` defines the VSCode extension configuration, including the snippet contribution point
- **Snippet Database**: `snippets/snippets.json` contains 200+ DaisyUI component snippets with prefixes, body templates, and descriptions
- **Assets**: `images/` directory contains extension icon and screenshot for marketplace listing
- **Distribution**: `bin/` contains packaged extension file (`daisyui-vscode-snippets.vsix`)

## Snippet Pattern

All snippets follow a consistent pattern:
- **Prefix**: Uses `d-` followed by component type and variant (e.g., `d-alert-success-color`, `d-accordion-with-arrow-icon`)
- **Body**: Array of HTML strings with DaisyUI CSS classes and structure
- **Description**: Descriptive text following pattern "daisyUI [Component]: [Variant]"

Components include: Accordion, Alert, Avatar, Badge, Breadcrumbs, Button, Card, Carousel, Chat, Checkbox, Collapse, Countdown, Drawer, Dropdown, File Input, Footer, Hero, Indicator, Input, Join, Kbd, Link, Loading, Menu, Mockup, Modal, Navbar, Pagination, Progress, Radio, Range, Rating, Select, Skeleton, Stack, Stat, Steps, Swap, Tab, Table, Textarea, Timeline, Toast, Toggle, Tooltip, and more.

## Development Commands

### Testing the Extension
```bash
# Open VSCode with the extension loaded for testing
code . 
# Press F5 to launch a new VSCode window with extension loaded
# Create a new HTML file and test snippets with `d-` prefixes
```

### Building/Packaging
```bash
# Package the extension (requires vsce tool)
vsce package
# This creates a .vsix file in the current directory
```

### Installing vsce (if needed)
```bash
npm install -g vsce
```

### Manual Installation
```bash
# Install the packaged extension
code --install-extension erb-vscode-snippets.vsix
```

## Snippet Development

### Adding New Snippets
1. Edit `snippets/snippets.json`
2. Follow the existing naming convention for prefixes (`d-[component]-[variant]`)
3. Ensure HTML structure uses proper DaisyUI CSS classes
4. Include descriptive text in the description field
5. Test in VSCode by pressing F5 to launch the extension host

### Snippet Structure Template
```json
"Component: Variant Name": {
  "prefix": "d-component-variant-name",
  "body": [
    "<div class=\"daisy-css-classes\">",
    "  <!-- component content -->",
    "</div>"
  ],
  "description": "daisyUI Component: Variant Name"
}
```

### Snippet Prefix Shortcuts
The extension supports abbreviated prefixes:
- Use component initials (e.g., `d-aa` for accordion variations)
- First letter of each word in component names
- This allows faster snippet discovery

## File Structure
```
├── package.json          # Extension manifest and configuration
├── snippets/
│   └── snippets.json     # All HTML snippets (5,880+ lines)
├── images/
│   ├── icon.png          # Extension marketplace icon
│   └── screenshot.jpg    # Feature demonstration
├── bin/
│   └── erb-vscode-snippets.vsix  # Packaged extension
├── README.md             # Project documentation
├── CHANGELOG.md          # Version history
└── vsc-extension-quickstart.md   # VSCode extension development guide
```

## Key Extension Configuration

The extension targets:
- **Language**: HTML files primarily (can work with ERB, Jinja, and similar templating languages)
- **VSCode Version**: ^1.5.0 and above
- **Category**: Snippets
- **Publisher**: Worajedt S.(PSP Asia Co.,Ltd.)

## Marketplace Distribution

Extension can be published to:
- VS Code Marketplace (primary distribution)
- Manual installation via .vsix file
- Direct snippet copying to user's VSCode settings
