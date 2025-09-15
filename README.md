<br /><br /><br />

<div align="center">

# Easey AI Page Builder

**The intelligent visual editor for React**

[Documentation](#documentation) • [Demo](#demo) • [Getting Started](#quick-start) • [Contributing](CONTRIBUTING.md)

⭐️ Building with Easey AI? Please [leave a star](https://github.com/easey-ai/page-builder)!

<br />

[![GIF showing a page being created in the Easey AI Page Builder, with AI-powered components being added, arranged, and customized in real time](https://github.com/user-attachments/assets/25e1ae25-ca5e-450f-afa0-01816830b731)](#demo)

</div>

## What is Easey AI Page Builder?

Easey AI Page Builder is an intelligent, modular visual editor for React.js powered by artificial intelligence. You can use it to build custom drag-and-drop experiences with AI-assisted component generation and smart design suggestions.

Built on top of React, it integrates seamlessly with all React.js environments, including Next.js. You maintain full control over your data with no vendor lock-in.

Easey AI Page Builder is [licensed under MIT](LICENSE), making it suitable for both internal systems and commercial applications.

## Quick start

Install the package:

```sh
npm i @easey-ai/page-builder --save # or npx create-easey-app my-app
```

Render the AI-powered editor:

```jsx
// Editor.jsx
import { EaseyPageBuilder } from "@easey-ai/page-builder";
import "@easey-ai/page-builder/styles.css";

// Create Easey AI component config
const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }) => {
        return <h1>{children}</h1>;
      },
    },
  },
};

// Describe the initial data
const initialData = {};

// Save the data to your database
const save = (data) => {};

// Render Easey AI Page Builder
export function Editor() {
  return <EaseyPageBuilder config={config} data={initialData} onPublish={save} />;
}
```

Render the page:

```jsx
// Page.jsx
import { Render } from "@easey-ai/page-builder";
import "@easey-ai/page-builder/styles.css";

export function Page() {
  return <Render config={config} data={data} />;
}
```

## Templates

Use `create-easey-app` to quickly spin up a pre-configured app based on our provided [templates](https://github.com/easey-ai/page-builder/tree/main/recipes):

```sh
npx create-easey-app my-app
```

Available templates include:

- [**next**](https://github.com/easey-ai/page-builder/tree/main/recipes/next): Next.js example with AI-powered page generation
- [**remix**](https://github.com/easey-ai/page-builder/tree/main/recipes/remix): Remix Run v2 example with intelligent routing
- [**react-router**](https://github.com/easey-ai/page-builder/tree/main/recipes/react-router): React Router v7 app with AI-assisted navigation

## AI Features

- **Smart Component Generation**: AI-powered component suggestions based on your content
- **Intelligent Layouts**: Automatic layout optimization using machine learning
- **Content Enhancement**: AI-driven content improvement and optimization
- **Design Suggestions**: Smart design recommendations for better user experience

## Community

- [Discord server](https://discord.gg/easey-ai) for discussions and support
- [awesome-easey](https://github.com/easey-ai/awesome-easey) community repo for plugins, custom fields & more

## Get Support

If you have any questions about Easey AI Page Builder, please open a [GitHub issue](https://github.com/easey-ai/page-builder/issues) or join us on [Discord](https://discord.gg/easey-ai).

For enterprise support and custom AI integrations, please contact our team.

## License

MIT © [The Easey AI Contributors](https://github.com/easey-ai/page-builder/graphs/contributors)
