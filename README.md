# ember-h-captcha

[hCaptcha](https://www.hcaptcha.com/) addon for Emberjs.

## Install

Run the following command from inside your ember-cli project:

    ember install ember-h-captcha

## Configure

You need to generate a valid Site Key / Secret Key pair on [hCaptcha site](https://dashboard.hcaptcha.com/signup).
Then, you need to set your Site Key in the `ENV` var on your `config/environment.js` file, like this:

```js
var ENV = {
  // ...
};

ENV['ember-h-captcha'] = {
  jsUrl: 'https://hcaptcha.com/1/api.js', // default
  sitekey: 'your-site-key',
  hl: 'tr', // Ex: Turkish
};
```

## Basic Usage

Add the component to your template like this:

```handlebars
<HCaptcha @onSuccess={{fn this.onCaptchaResolved}} />
```

then in your component or controller 's actions:

```js
  @action
  onCaptchaResolved(response) {
    this.model.set('response', response);
    // You should then save your model and the server would validate response
    // ...
  }
```

## Advanced Usage

### Handling Expiration

You know, after some time the hCaptcha response expires; `hCaptcha` 's default behavior is to invoke the [reset method](https://docs.hcaptcha.com/configuration#jsapi). But, if you want to perform custom behavior instead (e.g. transitioning to another route) you can pass your custom action via the `onExpired` property, like this:

```handlebars
<HCaptcha @onSuccess={{fn this.onCaptchaResolved}} @onExpired={{fn this.onCaptchaExpired}}
```

then in your component or controller 's actions:

```js
  @action
  onCaptchaExpired() {
    // your custom logic here
  }
```

### Triggering Reset

You might want to arbitrarily trigger [hCaptcha reset](https://docs.hcaptcha.com/configuration#jsapi). For example, if your form submission fails for errors on other fields, you might want to force user to solve a new hCaptcha challenge.
To do that, first you'll need to grab a reference to `hCaptcha` component in your template, like this:

```handlebars
<HCaptcha @onSuccess={{fn this.onCaptchaResolved}} @onRender={{fn (mut this.hCaptcha)}} />
```

then you'll be able to invoke `reset()` method on `hCaptcha` property anywhere in your component or controller 's code, like this:

```js
this.hCaptcha.reset();
```

### onRender Callback

You might want to pass a callback function that will be called after the hCaptcha renders on the page. onRender callback also returns component instance.
This is great for things like loading spinners. 
To do so, you can do something like this:

```handlebars
<HCaptcha @onSuccess={{fn this.onCaptchaResolved}} @onRender={{fn this.onCaptchaRendered}} />

```

then in your component or controller 's actions:

```js
  @action
  onCaptchaResolved() {
    // ...
  }

  @action
  onCaptchaRendered(instance) {
    // your custom onRender logic
  }
```

### onError Callback

You might want to pass a callback function that will be called after the error occured. To do so, you can do something like this:

```handlebars
<HCaptcha @onSuccess={{fn this.onCaptchaResolved}} @onError={{fn this.onCaptchaError}} />

```

then in your component or controller 's actions:

```js
  @action
  onCaptchaResolved() {
    // ...
  }

  @action
  onCaptchaError() {
    // Warn user
  }
```

### Customization

You can pass `hCaptcha` the following properties:

- `sitekey`
- `theme`
- `size`
- `tabIndex`

Their meaning is described on [this official doc](https://docs.hcaptcha.com/configuration#jsapi).

### Configuring source JavaScript URL

```js
var ENV = {
  // ...
};

ENV['ember-h-captcha'] = {
  jsUrl: 'https://hcaptcha.com/1/api.js', // default
  sitekey: 'your-site-key',
  hl: 'tr', // Locale Code - Ex: tr: Turkish
};
```

## License

Most of the README file taken from the [ember-g-recaptcha](https://github.com/algonauti/ember-g-recaptcha).
hCaptcha mostly compatible with Google reCaptcha.

ember-hCaptcha is released under the [MIT License](http://www.opensource.org/licenses/MIT).
