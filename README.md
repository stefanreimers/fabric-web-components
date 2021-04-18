# Fabric Web Components
Custom Elements wrapper for the Office UI Fabric JS components (the vanilla JavaScript version has been retired by MSFT in favor of the React version)

# Get started
The components are self-contained and work out of the box. There are no additional JavaScript or style files to include apart from the components themselves, e.g.

```html
<script type="text/javascript" src="dist/fabric-textfield.js"></script>
```




# Legacy versions
Legacy / ES5 versions of the components are available in the **es5 branch**.
Your browser must be capable of handling custom elements **v1**. If that's not the case there is a polyfill at the [Web Components repo](https://github.com/webcomponents/webcomponentsjs) which you can install by 

```
bower install --save webcomponents/custom-elements
```

The legacy elements are self contained JavaScript files with built-in templates, icons and styles. Therefore support for ShadowDOM and HTMLImports is not needed.
To include an element into your page simply use a common script tag, e.g.

```html
<script type="text/javascript" src="dist/es5/fabric-textfield.js"></script>
```
