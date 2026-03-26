const lines = (value) =>
  value
    .trim()
    .split("\n")
    .map((line) => line.replace(/^ {6}/, ""));

const defineSnippet = ({ component, variant = "Default", prefixes, description, body }) => ({
  component,
  variant,
  prefixes: Array.isArray(prefixes) ? prefixes : [prefixes],
  description,
  body: lines(body),
});

const curatedSnippets = [
  defineSnippet({
    component: "Alert",
    prefixes: ["d-alert"],
    description: "Alert with icon, title, and supporting text.",
    body: String.raw`
      <div role="alert" class="alert">
        <span class="font-semibold">\${1:Heads up}</span>
        <span>\${2:Share a short alert message with the user.}</span>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Alert",
    variant: "Info",
    prefixes: ["d-alert-info"],
    description: "Info alert with a concise status message.",
    body: String.raw`
      <div role="alert" class="alert alert-info">
        <span class="font-semibold">\${1:Update available}</span>
        <span>\${2:A new version is ready to install.}</span>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Alert",
    variant: "Actions",
    prefixes: ["d-alert-actions"],
    description: "Alert with message, primary action, and dismiss button.",
    body: String.raw`
      <div role="alert" class="alert">
        <div class="flex-1">
          <p class="font-semibold">\${1:Cookies enabled}</p>
          <p class="text-sm">\${2:We use cookies to keep the site running smoothly.}</p>
        </div>
        <div class="join">
          <button type="button" class="btn btn-sm btn-primary">\${3:Accept}</button>
          <button type="button" class="btn btn-sm btn-ghost">\${4:Dismiss}</button>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Badge",
    prefixes: ["d-badge"],
    description: "Neutral badge for compact labels.",
    body: String.raw`
      <span class="badge">\${1:New}</span>
      $0`,
  }),
  defineSnippet({
    component: "Badge",
    variant: "Outline",
    prefixes: ["d-badge-outline"],
    description: "Outlined badge for subtle metadata.",
    body: String.raw`
      <span class="badge badge-outline">\${1:Beta}</span>
      $0`,
  }),
  defineSnippet({
    component: "Badge",
    variant: "Soft",
    prefixes: ["d-badge-soft"],
    description: "Soft badge for low-emphasis status labels.",
    body: String.raw`
      <span class="badge badge-soft badge-primary">\${1:Updated}</span>
      $0`,
  }),
  defineSnippet({
    component: "Button",
    prefixes: ["d-button", "d-btn"],
    description: "Primary action button with editable label.",
    body: String.raw`
      <button type="button" class="btn">\${1:Click me}</button>
      $0`,
  }),
  defineSnippet({
    component: "Button",
    variant: "Primary",
    prefixes: ["d-button-primary", "d-btn-primary"],
    description: "Primary brand button.",
    body: String.raw`
      <button type="button" class="btn btn-primary">\${1:Save changes}</button>
      $0`,
  }),
  defineSnippet({
    component: "Button",
    variant: "Outline",
    prefixes: ["d-button-outline", "d-btn-outline"],
    description: "Outlined button for secondary actions.",
    body: String.raw`
      <button type="button" class="btn btn-outline">\${1:Learn more}</button>
      $0`,
  }),
  defineSnippet({
    component: "Button",
    variant: "Link",
    prefixes: ["d-button-link", "d-btn-link"],
    description: "Link-style button for tertiary actions.",
    body: String.raw`
      <button type="button" class="btn btn-link">\${1:Read docs}</button>
      $0`,
  }),
  defineSnippet({
    component: "Card",
    prefixes: ["d-card"],
    description: "Card with title, body text, and actions.",
    body: String.raw`
      <article class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">\${1:Card title}</h2>
          <p>\${2:Use this card to summarize a feature, offer, or update.}</p>
          <div class="card-actions justify-end">
            <button type="button" class="btn btn-primary">\${3:Action}</button>
          </div>
        </div>
      </article>
      $0`,
  }),
  defineSnippet({
    component: "Card",
    variant: "Image",
    prefixes: ["d-card-image"],
    description: "Card with top image, content, and CTA.",
    body: String.raw`
      <article class="card bg-base-100 shadow-sm">
        <figure>
          <img src="\${1:https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80}" alt="\${2:Featured image}" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">\${3:Featured story}</h2>
          <p>\${4:Pair an image with a short summary to highlight key content.}</p>
          <div class="card-actions justify-end">
            <a href="\${5:#}" class="btn btn-primary">\${6:Read more}</a>
          </div>
        </div>
      </article>
      $0`,
  }),
  defineSnippet({
    component: "Card",
    variant: "Side",
    prefixes: ["d-card-side"],
    description: "Side-by-side card with image and content.",
    body: String.raw`
      <article class="card card-side bg-base-100 shadow-sm">
        <figure>
          <img src="\${1:https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80}" alt="\${2:Side image}" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">\${3:Side card}</h2>
          <p>\${4:Great for announcements, product highlights, or compact feature callouts.}</p>
          <div class="card-actions justify-end">
            <button type="button" class="btn btn-primary">\${5:Explore}</button>
          </div>
        </div>
      </article>
      $0`,
  }),
  defineSnippet({
    component: "Dropdown",
    prefixes: ["d-dropdown"],
    description: "Dropdown menu anchored to a button.",
    body: String.raw`
      <div class="dropdown">
        <button type="button" tabindex="0" class="btn m-1">\${1:Open menu}</button>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-56 p-2 shadow-sm">
          <li><a href="\${2:#}">\${3:Profile}</a></li>
          <li><a href="\${4:#}">\${5:Settings}</a></li>
          <li><a href="\${6:#}">\${7:Logout}</a></li>
        </ul>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Dropdown",
    variant: "End",
    prefixes: ["d-dropdown-end"],
    description: "Right-aligned dropdown menu.",
    body: String.raw`
      <div class="dropdown dropdown-end">
        <button type="button" tabindex="0" class="btn m-1 btn-outline">\${1:Account}</button>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow-sm">
          <li><a href="\${2:#}">\${3:Dashboard}</a></li>
          <li><a href="\${4:#}">\${5:Billing}</a></li>
          <li><a href="\${6:#}">\${7:Sign out}</a></li>
        </ul>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Input",
    prefixes: ["d-input", "d-text-input"],
    description: "Text input with DaisyUI styling.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Email address}</span>
        </div>
        <input type="text" placeholder="\${2:you@example.com}" class="input input-bordered w-full" />
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Input",
    variant: "Ghost",
    prefixes: ["d-input-ghost"],
    description: "Ghost text input for low-emphasis fields.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Search}</span>
        </div>
        <input type="text" placeholder="\${2:Search the knowledge base}" class="input input-ghost w-full" />
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Modal",
    prefixes: ["d-modal"],
    description: "Modal dialog with title, body, and actions.",
    body: String.raw`
      <dialog id="\${1:dialog-modal}" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">\${2:Confirm action}</h3>
          <p class="py-4">\${3:Share the outcome of the action before the user commits.}</p>
          <div class="modal-action">
            <form method="dialog" class="join">
              <button class="btn">\${4:Cancel}</button>
              <button class="btn btn-primary">\${5:Continue}</button>
            </form>
          </div>
        </div>
      </dialog>
      $0`,
  }),
  defineSnippet({
    component: "Modal",
    variant: "Toggle",
    prefixes: ["d-modal-toggle"],
    description: "Checkbox-driven modal pattern with open trigger.",
    body: String.raw`
      <input type="checkbox" id="\${1:modal-toggle}" class="modal-toggle" />
      <label for="\${1:modal-toggle}" class="btn">\${2:Open modal}</label>
      <div class="modal" role="dialog">
        <div class="modal-box">
          <h3 class="text-lg font-bold">\${3:Hello there}</h3>
          <p class="py-4">\${4:Use this pattern when you prefer simple static markup over dialog scripting.}</p>
        </div>
        <label class="modal-backdrop" for="\${1:modal-toggle}">\${5:Close}</label>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Navbar",
    prefixes: ["d-navbar"],
    description: "Navbar with brand, navigation links, and CTA.",
    body: String.raw`
      <nav class="navbar bg-base-100 shadow-sm">
        <div class="navbar-start">
          <a href="\${1:#}" class="btn btn-ghost text-xl">\${2:Brand}</a>
        </div>
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            <li><a href="\${3:#features}">\${4:Features}</a></li>
            <li><a href="\${5:#pricing}">\${6:Pricing}</a></li>
            <li><a href="\${7:#contact}">\${8:Contact}</a></li>
          </ul>
        </div>
        <div class="navbar-end">
          <a href="\${9:#signup}" class="btn btn-primary">\${10:Get started}</a>
        </div>
      </nav>
      $0`,
  }),
  defineSnippet({
    component: "Navbar",
    variant: "Centered",
    prefixes: ["d-navbar-centered"],
    description: "Centered navbar with compact action button.",
    body: String.raw`
      <nav class="navbar bg-base-100 border border-base-300 rounded-box px-4">
        <div class="navbar-start">
          <button type="button" class="btn btn-ghost btn-square" aria-label="\${1:Open navigation}">
            <span class="text-xl">\${2:=}</span>
          </button>
        </div>
        <div class="navbar-center">
          <a href="\${3:#}" class="font-semibold text-lg">\${4:Workspace}</a>
        </div>
        <div class="navbar-end">
          <button type="button" class="btn btn-sm btn-outline">\${5:Invite}</button>
        </div>
      </nav>
      $0`,
  }),
  defineSnippet({
    component: "Table",
    prefixes: ["d-table"],
    description: "Responsive table with headings and three editable rows.",
    body: String.raw`
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>\${1:Name}</th>
              <th>\${2:Role}</th>
              <th>\${3:Status}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>\${4:Olivia Rhye}</td>
              <td>\${5:Product Designer}</td>
              <td>\${6:Active}</td>
            </tr>
            <tr>
              <td>\${7:Lana Steiner}</td>
              <td>\${8:Frontend Engineer}</td>
              <td>\${9:Review}</td>
            </tr>
            <tr>
              <td>\${10:Phoenix Baker}</td>
              <td>\${11:Support Lead}</td>
              <td>\${12:Paused}</td>
            </tr>
          </tbody>
        </table>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Table",
    variant: "Zebra",
    prefixes: ["d-table-zebra"],
    description: "Zebra-striped table for denser data views.",
    body: String.raw`
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>\${1:Plan}</th>
              <th>\${2:Users}</th>
              <th>\${3:Price}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>\${4:Starter}</td>
              <td>\${5:3}</td>
              <td>\${6:$19}</td>
            </tr>
            <tr>
              <td>\${7:Growth}</td>
              <td>\${8:10}</td>
              <td>\${9:$49}</td>
            </tr>
            <tr>
              <td>\${10:Scale}</td>
              <td>\${11:Unlimited}</td>
              <td>\${12:$99}</td>
            </tr>
          </tbody>
        </table>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Textarea",
    prefixes: ["d-textarea"],
    description: "Textarea with label and placeholder copy.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Project brief}</span>
        </div>
        <textarea class="textarea textarea-bordered h-32 w-full" placeholder="\${2:Describe the goal, audience, and constraints.}"></textarea>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Textarea",
    variant: "Ghost",
    prefixes: ["d-textarea-ghost"],
    description: "Ghost textarea for lower-emphasis notes.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Internal notes}</span>
        </div>
        <textarea class="textarea textarea-ghost h-28 w-full" placeholder="\${2:Drop lightweight notes here.}"></textarea>
      </label>
      $0`,
  }),
];

const fallbackSnippets = [
  defineSnippet({
    component: "Document",
    prefixes: ["!d"],
    description: "Full HTML document starter with DaisyUI and Tailwind browser CDN links.",
    body: String.raw`
      <!doctype html>
      <html lang="en" data-theme="\${1:light}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>\${2:DaisyUI Starter}</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body class="min-h-screen bg-base-200">
        <main class="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
          <section class="hero w-full rounded-box bg-base-100 shadow-xl">
            <div class="hero-content text-center">
              <div class="max-w-2xl">
                <span class="badge badge-primary badge-outline mb-4">\${3:DaisyUI + Tailwind CDN}</span>
                <h1 class="text-4xl font-bold text-balance md:text-5xl">\${4:Build a polished UI quickly}</h1>
                <p class="py-6 text-base-content/80">\${5:Start prototyping with DaisyUI components and Tailwind utilities in a single HTML file.}</p>
                <div class="flex flex-col justify-center gap-3 sm:flex-row">
                  <button type="button" class="btn btn-primary">\${6:Get started}</button>
                  <button type="button" class="btn btn-outline">\${7:Open docs}</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </body>
      </html>
      $0`,
  }),
  defineSnippet({
    component: "Accordion",
    prefixes: ["d-accordion"],
    description: "Accordion group built with DaisyUI collapse items.",
    body: String.raw`
      <div class="join join-vertical w-full">
        <div class="collapse collapse-arrow join-item border border-base-300">
          <input type="radio" name="\${1:accordion-demo}" checked="checked" />
          <div class="collapse-title text-base font-semibold">\${2:What is DaisyUI?}</div>
          <div class="collapse-content text-sm">\${3:DaisyUI is a component library built on top of Tailwind CSS.}</div>
        </div>
        <div class="collapse collapse-arrow join-item border border-base-300">
          <input type="radio" name="\${1:accordion-demo}" />
          <div class="collapse-title text-base font-semibold">\${4:How do I install it?}</div>
          <div class="collapse-content text-sm">\${5:Add the DaisyUI plugin to your Tailwind configuration.}</div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Accordion",
    variant: "Plus",
    prefixes: ["d-accordion-plus"],
    description: "Accordion group with plus indicator styling.",
    body: String.raw`
      <div class="space-y-3">
        <div class="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="checkbox" checked="checked" />
          <div class="collapse-title text-base font-semibold">\${1:What is included?}</div>
          <div class="collapse-content text-sm">\${2:Summarize the included features or package details here.}</div>
        </div>
        <div class="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="checkbox" />
          <div class="collapse-title text-base font-semibold">\${3:Can I customize it?}</div>
          <div class="collapse-content text-sm">\${4:Use this second item for a secondary FAQ answer.}</div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Avatar",
    prefixes: ["d-avatar"],
    description: "Avatar image with rounded framing.",
    body: String.raw`
      <div class="avatar">
        <div class="w-24 rounded-full">
          <img src="\${1:https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80}" alt="\${2:Avatar}" />
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Avatar",
    variant: "Group",
    prefixes: ["d-avatar-group"],
    description: "Overlapping avatar group for teams or participants.",
    body: String.raw`
      <div class="avatar-group -space-x-4 rtl:space-x-reverse">
        <div class="avatar">
          <div class="w-12">
            <img src="\${1:https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80}" alt="\${2:Teammate one}" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-12">
            <img src="\${3:https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80}" alt="\${4:Teammate two}" />
          </div>
        </div>
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-12">
            <span>\${5:+3}</span>
          </div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Breadcrumbs",
    prefixes: ["d-breadcrumbs"],
    description: "Breadcrumb navigation with three levels.",
    body: String.raw`
      <nav class="breadcrumbs text-sm" aria-label="\${1:Breadcrumb}">
        <ul>
          <li><a href="\${2:#}">\${3:Home}</a></li>
          <li><a href="\${4:#}">\${5:Library}</a></li>
          <li>\${6:Current page}</li>
        </ul>
      </nav>
      $0`,
  }),
  defineSnippet({
    component: "Calendar",
    prefixes: ["d-calendar"],
    description: "Calendar-style card shell for scheduling layouts.",
    body: String.raw`
      <section class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">\${1:March 2026}</h2>
          <div class="grid grid-cols-7 gap-2 text-center text-sm">
            <span>\${2:Mo}</span>
            <span>\${3:Tu}</span>
            <span>\${4:We}</span>
            <span>\${5:Th}</span>
            <span>\${6:Fr}</span>
            <span>\${7:Sa}</span>
            <span>\${8:Su}</span>
          </div>
          <p class="text-sm text-base-content/70">\${9:Replace the grid body with your booking or event cells.}</p>
        </div>
      </section>
      $0`,
  }),
  defineSnippet({
    component: "Carousel",
    prefixes: ["d-carousel"],
    description: "Simple carousel with three slides.",
    body: String.raw`
      <div class="carousel rounded-box w-full">
        <div class="carousel-item w-full">
          <img src="\${1:https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80}" class="w-full" alt="\${2:Slide one}" />
        </div>
        <div class="carousel-item w-full">
          <img src="\${3:https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80}" class="w-full" alt="\${4:Slide two}" />
        </div>
        <div class="carousel-item w-full">
          <img src="\${5:https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80}" class="w-full" alt="\${6:Slide three}" />
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Chat Bubble",
    prefixes: ["d-chat", "d-chat-bubble"],
    description: "Single incoming chat message bubble.",
    body: String.raw`
      <div class="chat chat-start">
        <div class="chat-header">
          \${1:Support}
          <time class="text-xs opacity-50">\${2:12:45}</time>
        </div>
        <div class="chat-bubble">\${3:How can we help you today?}</div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Checkbox",
    prefixes: ["d-checkbox"],
    description: "Checkbox with visible label text.",
    body: String.raw`
      <label class="label cursor-pointer justify-start gap-3">
        <input type="checkbox" class="checkbox" />
        <span class="label-text">\${1:Enable email updates}</span>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Checkbox",
    variant: "Primary",
    prefixes: ["d-checkbox-primary"],
    description: "Primary checkbox with helper label layout.",
    body: String.raw`
      <label class="label cursor-pointer justify-start gap-3">
        <input type="checkbox" class="checkbox checkbox-primary" checked="checked" />
        <div>
          <span class="label-text font-medium">\${1:Enable public sharing}</span>
          <p class="text-sm text-base-content/70">\${2:Allow anyone with the link to access this page.}</p>
        </div>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Collapse",
    prefixes: ["d-collapse"],
    description: "Single expandable collapse panel.",
    body: String.raw`
      <div class="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="checkbox" />
        <div class="collapse-title text-base font-semibold">\${1:Section title}</div>
        <div class="collapse-content text-sm">\${2:Add the content you want to reveal here.}</div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Countdown",
    prefixes: ["d-countdown"],
    description: "Countdown stat block with one editable value.",
    body: String.raw`
      <div class="grid auto-cols-max grid-flow-col gap-5 text-center">
        <div class="flex flex-col rounded-box bg-base-200 p-4">
          <span class="countdown font-mono text-5xl">
            <span style="--value:\${1:12};" aria-label="\${1:12}"></span>
          </span>
          \${2:hours}
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Diff",
    prefixes: ["d-diff"],
    description: "Two-column comparison shell for before/after content.",
    body: String.raw`
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-box border border-base-300 p-4">
          <h3 class="font-semibold">\${1:Before}</h3>
          <p class="text-sm">\${2:Describe the original state.}</p>
        </div>
        <div class="rounded-box border border-primary p-4">
          <h3 class="font-semibold">\${3:After}</h3>
          <p class="text-sm">\${4:Explain the improved state.}</p>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Divider",
    prefixes: ["d-divider"],
    description: "Centered divider label.",
    body: String.raw`
      <div class="divider">\${1:OR}</div>
      $0`,
  }),
  defineSnippet({
    component: "Dock",
    prefixes: ["d-dock"],
    description: "Bottom dock navigation with three actions.",
    body: String.raw`
      <div class="dock">
        <button type="button" class="dock-active">\${1:Home}</button>
        <button type="button">\${2:Search}</button>
        <button type="button">\${3:Profile}</button>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Drawer",
    prefixes: ["d-drawer"],
    description: "Drawer layout with sidebar navigation.",
    body: String.raw`
      <div class="drawer lg:drawer-open">
        <input id="\${1:app-drawer}" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content p-4">
          <label for="\${1:app-drawer}" class="btn btn-primary drawer-button lg:hidden">\${2:Open menu}</label>
          <div class="mt-4 rounded-box border border-base-300 p-4">\${3:Main content}</div>
        </div>
        <div class="drawer-side">
          <label for="\${1:app-drawer}" class="drawer-overlay"></label>
          <ul class="menu bg-base-200 min-h-full w-80 p-4">
            <li><a href="\${4:#}">\${5:Dashboard}</a></li>
            <li><a href="\${6:#}">\${7:Settings}</a></li>
          </ul>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Fieldset",
    prefixes: ["d-fieldset"],
    description: "Fieldset with legend and helper text.",
    body: String.raw`
      <fieldset class="fieldset bg-base-100 border border-base-300 rounded-box p-4">
        <legend class="fieldset-legend">\${1:Profile details}</legend>
        <p class="text-sm">\${2:Group related form controls with a fieldset.}</p>
      </fieldset>
      $0`,
  }),
  defineSnippet({
    component: "File Input",
    prefixes: ["d-file-input"],
    description: "File input with a visible label.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Upload cover image}</span>
        </div>
        <input type="file" class="file-input file-input-bordered w-full" />
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Filter",
    prefixes: ["d-filter"],
    description: "Filter chip group with three options.",
    body: String.raw`
      <div class="join">
        <button type="button" class="btn join-item btn-active">\${1:All}</button>
        <button type="button" class="btn join-item">\${2:Open}</button>
        <button type="button" class="btn join-item">\${3:Closed}</button>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Footer",
    prefixes: ["d-footer"],
    description: "Footer with title and link column.",
    body: String.raw`
      <footer class="footer bg-base-200 text-base-content rounded-box p-10">
        <aside>
          <p class="font-semibold">\${1:Brand Inc.}</p>
          <p>\${2:Helping teams ship faster with better UI systems.}</p>
        </aside>
        <nav>
          <h6 class="footer-title">\${3:Links}</h6>
          <a href="\${4:#}" class="link link-hover">\${5:Docs}</a>
          <a href="\${6:#}" class="link link-hover">\${7:Pricing}</a>
          <a href="\${8:#}" class="link link-hover">\${9:Contact}</a>
        </nav>
      </footer>
      $0`,
  }),
  defineSnippet({
    component: "Footer",
    variant: "Centered",
    prefixes: ["d-footer-centered"],
    description: "Centered footer with compact navigation links.",
    body: String.raw`
      <footer class="footer footer-center bg-base-200 text-base-content rounded-box p-8">
        <nav class="grid grid-flow-col gap-4">
          <a href="\${1:#}" class="link link-hover">\${2:About}</a>
          <a href="\${3:#}" class="link link-hover">\${4:Docs}</a>
          <a href="\${5:#}" class="link link-hover">\${6:Contact}</a>
        </nav>
        <aside>
          <p>\${7:Copyright © 2026 - All rights reserved}</p>
        </aside>
      </footer>
      $0`,
  }),
  defineSnippet({
    component: "Hero",
    prefixes: ["d-hero"],
    description: "Hero section with title, body, and CTA.",
    body: String.raw`
      <section class="hero bg-base-200 rounded-box">
        <div class="hero-content py-16 text-center">
          <div class="max-w-2xl">
            <h1 class="text-5xl font-bold">\${1:Build better with DaisyUI}</h1>
            <p class="py-6">\${2:Use this hero block to introduce your product, campaign, or feature launch.}</p>
            <a href="\${3:#}" class="btn btn-primary">\${4:Get started}</a>
          </div>
        </div>
      </section>
      $0`,
  }),
  defineSnippet({
    component: "Hero",
    variant: "Split",
    prefixes: ["d-hero-split"],
    description: "Split hero layout with copy and supporting card.",
    body: String.raw`
      <section class="hero bg-base-200 rounded-box">
        <div class="hero-content flex-col gap-10 lg:flex-row lg:items-center">
          <div class="max-w-xl">
            <span class="badge badge-secondary badge-outline mb-4">\${1:Launch ready}</span>
            <h1 class="text-5xl font-bold">\${2:Ship the next version with confidence}</h1>
            <p class="py-6">\${3:Use a split hero when you want a stronger product-marketing layout with supporting proof or metrics.}</p>
            <div class="flex flex-col gap-3 sm:flex-row">
              <a href="\${4:#}" class="btn btn-primary">\${5:Start trial}</a>
              <a href="\${6:#}" class="btn btn-outline">\${7:See demo}</a>
            </div>
          </div>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <p class="text-sm text-base-content/70">\${8:Trusted by teams shipping every day}</p>
              <p class="text-4xl font-bold">\${9:42% faster}</p>
              <p>\${10:Average reduction in UI build time after adopting a shared component system.}</p>
            </div>
          </div>
        </div>
      </section>
      $0`,
  }),
  defineSnippet({
    component: "Indicator",
    prefixes: ["d-indicator"],
    description: "Indicator badge attached to an element.",
    body: String.raw`
      <div class="indicator">
        <span class="indicator-item badge badge-secondary">\${1:New}</span>
        <button type="button" class="btn">\${2:Inbox}</button>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Join",
    prefixes: ["d-join"],
    description: "Joined button group.",
    body: String.raw`
      <div class="join">
        <button type="button" class="btn join-item">\${1:Previous}</button>
        <button type="button" class="btn join-item btn-active">\${2:Current}</button>
        <button type="button" class="btn join-item">\${3:Next}</button>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Kbd",
    prefixes: ["d-kbd"],
    description: "Keyboard shortcut hint.",
    body: String.raw`
      <kbd class="kbd">\${1:⌘}</kbd>
      <kbd class="kbd">\${2:K}</kbd>
      $0`,
  }),
  defineSnippet({
    component: "Label",
    prefixes: ["d-label"],
    description: "Standalone label text pair.",
    body: String.raw`
      <div class="label">
        <span class="label-text">\${1:Primary label}</span>
        <span class="label-text-alt">\${2:Optional helper}</span>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Link",
    prefixes: ["d-link"],
    description: "Text link with DaisyUI styling.",
    body: String.raw`
      <a href="\${1:#}" class="link">\${2:Open resource}</a>
      $0`,
  }),
  defineSnippet({
    component: "List",
    prefixes: ["d-list"],
    description: "DaisyUI list with three items.",
    body: String.raw`
      <ul class="list bg-base-100 rounded-box shadow-sm">
        <li class="list-row">\${1:First item}</li>
        <li class="list-row">\${2:Second item}</li>
        <li class="list-row">\${3:Third item}</li>
      </ul>
      $0`,
  }),
  defineSnippet({
    component: "Loading",
    prefixes: ["d-loading"],
    description: "Loading spinner for pending states.",
    body: String.raw`
      <span class="loading loading-spinner loading-md" aria-label="\${1:Loading}"></span>
      $0`,
  }),
  defineSnippet({
    component: "Mask",
    prefixes: ["d-mask"],
    description: "Masked image with squircle frame.",
    body: String.raw`
      <img src="\${1:https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80}" alt="\${2:Masked image}" class="mask mask-squircle h-24 w-24 object-cover" />
      $0`,
  }),
  defineSnippet({
    component: "Menu",
    prefixes: ["d-menu"],
    description: "Vertical navigation menu.",
    body: String.raw`
      <ul class="menu bg-base-200 rounded-box w-56">
        <li><a href="\${1:#}">\${2:Overview}</a></li>
        <li><a href="\${3:#}">\${4:Projects}</a></li>
        <li><a href="\${5:#}">\${6:Settings}</a></li>
      </ul>
      $0`,
  }),
  defineSnippet({
    component: "Menu",
    variant: "Horizontal",
    prefixes: ["d-menu-horizontal"],
    description: "Horizontal navigation menu for headers and toolbars.",
    body: String.raw`
      <ul class="menu menu-horizontal bg-base-200 rounded-box">
        <li><a href="\${1:#}">\${2:Overview}</a></li>
        <li><a href="\${3:#}">\${4:Roadmap}</a></li>
        <li><a href="\${5:#}">\${6:Changelog}</a></li>
      </ul>
      $0`,
  }),
  defineSnippet({
    component: "Mockup Browser",
    prefixes: ["d-mockup-browser"],
    description: "Browser mockup frame for screenshots or demos.",
    body: String.raw`
      <div class="mockup-browser border border-base-300">
        <div class="mockup-browser-toolbar">
          <div class="input border border-base-300">\${1:https://example.com}</div>
        </div>
        <div class="grid place-content-center p-10">\${2:App preview}</div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Mockup Code",
    prefixes: ["d-mockup-code"],
    description: "Code block inside a mockup frame.",
    body: String.raw`
      <div class="mockup-code">
        <pre data-prefix="$"><code>\${1:npm install daisyui}</code></pre>
        <pre data-prefix=">"><code>\${2:Done in 2.34s}</code></pre>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Mockup Phone",
    prefixes: ["d-mockup-phone"],
    description: "Phone mockup with a display area.",
    body: String.raw`
      <div class="mockup-phone border border-base-300">
        <div class="camera"></div>
        <div class="display">
          <div class="artboard artboard-demo phone-1">\${1:Mobile UI preview}</div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Mockup Window",
    prefixes: ["d-mockup-window"],
    description: "Window mockup frame for desktop previews.",
    body: String.raw`
      <div class="mockup-window border border-base-300">
        <div class="p-6">\${1:Desktop UI preview}</div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Pagination",
    prefixes: ["d-pagination"],
    description: "Pagination control using joined buttons.",
    body: String.raw`
      <div class="join">
        <button type="button" class="join-item btn">\${1:«}</button>
        <button type="button" class="join-item btn btn-active">\${2:Page 1}</button>
        <button type="button" class="join-item btn">\${3:»}</button>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Progress",
    prefixes: ["d-progress"],
    description: "Progress bar with editable value.",
    body: String.raw`
      <progress class="progress progress-primary w-56" value="\${1:45}" max="100"></progress>
      $0`,
  }),
  defineSnippet({
    component: "Radial Progress",
    prefixes: ["d-radial-progress", "d-progress-radial"],
    description: "Radial progress indicator with a visible percentage.",
    body: String.raw`
      <div class="radial-progress text-primary" style="--value:\${1:70};" aria-valuenow="\${1:70}" role="progressbar">\${2:70%}</div>
      $0`,
  }),
  defineSnippet({
    component: "Radio",
    prefixes: ["d-radio"],
    description: "Radio input paired with a label.",
    body: String.raw`
      <label class="label cursor-pointer justify-start gap-3">
        <input type="radio" name="\${1:radio-demo}" class="radio" />
        <span class="label-text">\${2:Choose this option}</span>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Range",
    prefixes: ["d-range", "d-range-slider"],
    description: "Range slider with DaisyUI styling.",
    body: String.raw`
      <input type="range" min="0" max="100" value="\${1:40}" class="range" />
      $0`,
  }),
  defineSnippet({
    component: "Rating",
    prefixes: ["d-rating"],
    description: "Five-star rating control.",
    body: String.raw`
      <div class="rating">
        <input type="radio" name="\${1:rating-demo}" class="mask mask-star-2 bg-orange-400" aria-label="\${2:1 star}" />
        <input type="radio" name="\${1:rating-demo}" class="mask mask-star-2 bg-orange-400" aria-label="\${3:2 stars}" checked="checked" />
        <input type="radio" name="\${1:rating-demo}" class="mask mask-star-2 bg-orange-400" aria-label="\${4:3 stars}" />
        <input type="radio" name="\${1:rating-demo}" class="mask mask-star-2 bg-orange-400" aria-label="\${5:4 stars}" />
        <input type="radio" name="\${1:rating-demo}" class="mask mask-star-2 bg-orange-400" aria-label="\${6:5 stars}" />
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Select",
    prefixes: ["d-select"],
    description: "Select field with label.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Choose a plan}</span>
        </div>
        <select class="select select-bordered w-full">
          <option>\${2:Starter}</option>
          <option>\${3:Growth}</option>
          <option>\${4:Scale}</option>
        </select>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Select",
    variant: "Ghost",
    prefixes: ["d-select-ghost"],
    description: "Ghost select for low-emphasis filtering and utility controls.",
    body: String.raw`
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">\${1:Filter by status}</span>
        </div>
        <select class="select select-ghost w-full">
          <option>\${2:All}</option>
          <option>\${3:Open}</option>
          <option>\${4:Closed}</option>
        </select>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Skeleton",
    prefixes: ["d-skeleton"],
    description: "Skeleton loader block.",
    body: String.raw`
      <div class="flex items-center gap-4" aria-label="\${1:Loading content}">
        <div class="skeleton h-12 w-12 shrink-0 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-1/2"></div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Stack",
    prefixes: ["d-stack"],
    description: "Stacked cards for layered visuals.",
    body: String.raw`
      <div class="stack">
        <div class="card bg-primary text-primary-content shadow-sm">
          <div class="card-body">\${1:Top card}</div>
        </div>
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body">\${2:Middle card}</div>
        </div>
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">\${3:Bottom card}</div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Stat",
    prefixes: ["d-stat"],
    description: "Single stat card with title, value, and helper copy.",
    body: String.raw`
      <div class="stats shadow-sm">
        <div class="stat">
          <div class="stat-title">\${1:Monthly revenue}</div>
          <div class="stat-value">\${2:$18.4K}</div>
          <div class="stat-desc">\${3:+12% from last month}</div>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Steps",
    prefixes: ["d-steps"],
    description: "Progress steps with four milestones.",
    body: String.raw`
      <ul class="steps">
        <li class="step step-primary">\${1:Plan}</li>
        <li class="step step-primary">\${2:Build}</li>
        <li class="step">\${3:Review}</li>
        <li class="step">\${4:Launch}</li>
      </ul>
      $0`,
  }),
  defineSnippet({
    component: "Swap",
    prefixes: ["d-swap"],
    description: "Swap control with on/off labels.",
    body: String.raw`
      <label class="swap">
        <input type="checkbox" />
        <span class="swap-on">\${1:On}</span>
        <span class="swap-off">\${2:Off}</span>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Tabs",
    prefixes: ["d-tabs", "d-tab"],
    description: "Three-tab navigation strip.",
    body: String.raw`
      <div role="tablist" class="tabs tabs-boxed">
        <a role="tab" class="tab tab-active">\${1:Overview}</a>
        <a role="tab" class="tab">\${2:Details}</a>
        <a role="tab" class="tab">\${3:Settings}</a>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Tabs",
    variant: "Lifted",
    prefixes: ["d-tabs-lifted"],
    description: "Lifted tabs for dashboard or settings panels.",
    body: String.raw`
      <div role="tablist" class="tabs tabs-lifted">
        <a role="tab" class="tab tab-active">\${1:Account}</a>
        <a role="tab" class="tab">\${2:Team}</a>
        <a role="tab" class="tab">\${3:Billing}</a>
      </div>
      <div class="rounded-box rounded-tl-none border border-base-300 bg-base-100 p-6">
        <p>\${4:Use the panel below the tabs for contextual settings content.}</p>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Theme Controller",
    prefixes: ["d-theme-controller"],
    description: "Theme toggle shell for DaisyUI themes.",
    body: String.raw`
      <label class="label cursor-pointer justify-start gap-3">
        <input type="checkbox" value="\${1:night}" class="toggle theme-controller" />
        <span class="label-text">\${2:Use dark theme}</span>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Timeline",
    prefixes: ["d-timeline"],
    description: "Simple vertical timeline with three milestones.",
    body: String.raw`
      <ul class="timeline timeline-vertical">
        <li>
          <div class="timeline-start">\${1:Kickoff}</div>
          <div class="timeline-middle"></div>
          <div class="timeline-end timeline-box">\${2:Project brief approved}</div>
        </li>
        <li>
          <hr />
          <div class="timeline-start">\${3:Build}</div>
          <div class="timeline-middle"></div>
          <div class="timeline-end timeline-box">\${4:First prototype shipped}</div>
          <hr />
        </li>
        <li>
          <div class="timeline-start">\${5:Launch}</div>
          <div class="timeline-middle"></div>
          <div class="timeline-end timeline-box">\${6:Public release}</div>
        </li>
      </ul>
      $0`,
  }),
  defineSnippet({
    component: "Toast",
    prefixes: ["d-toast"],
    description: "Toast stack with one alert item.",
    body: String.raw`
      <div class="toast toast-end">
        <div class="alert alert-success">
          <span>\${1:Changes saved successfully.}</span>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Toast",
    variant: "Success",
    prefixes: ["d-toast-success"],
    description: "Toast stack with a success message and CTA.",
    body: String.raw`
      <div class="toast toast-end">
        <div class="alert alert-success">
          <span>\${1:Profile updated successfully.}</span>
          <a href="\${2:#}" class="btn btn-xs btn-ghost">\${3:View}</a>
        </div>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Toggle",
    prefixes: ["d-toggle"],
    description: "Toggle switch with label text.",
    body: String.raw`
      <label class="label cursor-pointer justify-start gap-3">
        <input type="checkbox" class="toggle" />
        <span class="label-text">\${1:Enable notifications}</span>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Toggle",
    variant: "Primary",
    prefixes: ["d-toggle-primary"],
    description: "Primary toggle with helper copy for settings screens.",
    body: String.raw`
      <label class="label cursor-pointer justify-start gap-3">
        <input type="checkbox" class="toggle toggle-primary" checked="checked" />
        <div>
          <span class="label-text font-medium">\${1:Enable smart summaries}</span>
          <p class="text-sm text-base-content/70">\${2:Generate a short recap after each completed workflow.}</p>
        </div>
      </label>
      $0`,
  }),
  defineSnippet({
    component: "Tooltip",
    prefixes: ["d-tooltip"],
    description: "Tooltip wrapper with editable helper text.",
    body: String.raw`
      <div class="tooltip" data-tip="\${1:Helpful context goes here}">
        <button type="button" class="btn">\${2:Hover me}</button>
      </div>
      $0`,
  }),
  defineSnippet({
    component: "Tree",
    prefixes: ["d-tree"],
    description: "Nested tree navigation shell.",
    body: String.raw`
      <ul class="menu bg-base-100 rounded-box w-64">
        <li>
          <details open>
            <summary>\${1:Workspace}</summary>
            <ul>
              <li><a href="\${2:#}">\${3:Design}</a></li>
              <li><a href="\${4:#}">\${5:Engineering}</a></li>
            </ul>
          </details>
        </li>
      </ul>
      $0`,
  }),
  defineSnippet({
    component: "Validator",
    prefixes: ["d-validator"],
    description: "Validated input with helper message.",
    body: String.raw`
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">\${1:Email address}</span>
        </div>
        <input type="email" placeholder="\${2:you@example.com}" class="input input-bordered validator w-full" required />
        <div class="label">
          <span class="label-text-alt text-error">\${3:Please enter a valid email address.}</span>
        </div>
      </label>
      $0`,
  }),
];

export const snippetCatalog = [...curatedSnippets, ...fallbackSnippets].sort((left, right) => {
  const componentCompare = left.component.localeCompare(right.component);
  if (componentCompare !== 0) {
    return componentCompare;
  }
  return left.variant.localeCompare(right.variant);
});
