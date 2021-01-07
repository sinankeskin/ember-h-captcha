/* globals hcaptcha */

import { action, get } from '@ember/object';

import Component from '@glimmer/component';
import { assign } from '@ember/polyfills';
import { cached } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import { isPresent } from '@ember/utils';

export default class HCaptchaComponent extends Component {
  @cached
  get config() {
    const _config =
      getOwner(this).resolveRegistration('config:environment') || {};

    return _config['ember-h-captcha'] || {};
  }

  @cached
  get options() {
    let _options = {};

    assign(_options, this.config, this.componentOptions);

    return _options;
  }

  @cached
  get componentOptions() {
    const defaults = ['sitekey', 'theme', 'size', 'tabindex'];

    const options = {};

    defaults.forEach((option) => {
      if (isPresent(get(this.args, option))) {
        options[option] = get(this.args, option);
      }
    });

    return options;
  }

  @action
  initialize(element) {
    window.__ember_h_captcha_onload = () => {
      this.render(element);
    };

    this.appendScript(
      [
        `${
          this.config['jsUrl'] || 'https://hcaptcha.com/1/api.js'
        }?render=explicit`,
        'onload=__ember_h_captcha_onload',
        this.config['hl'] ? `hl=${this.config['hl']}` : '',
      ].join('&')
    );
  }

  render(element) {
    const parameters = assign(this.options, {
      callback: this.onSuccessCallback.bind(this),
      'expired-callback': this.onExpiredCallback.bind(this),
      'error-callback': this.onErrorCallback.bind(this),
    });

    this.widgetId = hcaptcha.render(element, parameters);

    this.onRenderCallback();
  }

  onRenderCallback() {
    const action = this.args.onRender;

    if (isPresent(action) && typeof action === 'function') {
      action(this);
    }
  }

  appendScript(src) {
    let scriptTag = document.createElement('script');
    scriptTag.src = src;
    scriptTag.async = true;
    scriptTag.defer = true;

    document.body.appendChild(scriptTag);
  }

  onSuccessCallback(response) {
    const action = this.args.onSuccess;

    if (isPresent(action) && typeof action === 'function') {
      action(response);
    }
  }

  onExpiredCallback() {
    const action = this.args.onExpired;

    if (isPresent(action) && typeof action === 'function') {
      action();
    }
  }

  onErrorCallback(error) {
    const action = this.args.onError;

    if (isPresent(action) && typeof action === 'function') {
      action(error);
    }
  }

  reset() {
    if (isPresent(this.widgetId)) {
      hcaptcha.reset(this.widgetId);
    }
  }
}
