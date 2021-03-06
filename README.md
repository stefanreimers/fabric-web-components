# Fabric Web Components
Custom Elements v1 wrapper for the Office UI Fabric JS components (retired by MS)

# Get started
Your browser must be capable of handling custom elements **v1**. If that's not the case there is a polyfill at the [Web Components repo](https://github.com/webcomponents/webcomponentsjs) which you can install by 

```
bower install --save webcomponents/custom-elements
```

The legacy elements are self contained JavaScript files with built-in templates, icons and styles. Therefore support for ShadowDOM and HTMLImports is not needed.
To include an element into your page simply use a common script tag, e.g.

```html
<script type="text/javascript" src="dist/es5/fabric-textfield.js"></script>
```
