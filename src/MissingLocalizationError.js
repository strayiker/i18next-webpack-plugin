/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */

export default class MissingLocalizationError extends Error {
  constructor(module, name, value) {
    super();

    this.name = 'MissingLocalizationError';
    this.requests = [{ name, value }];
    this.module = module;
    this.buildMessage();

    if (typeof Error.captureStackTrace !== 'function') {
      this.stack = (new Error(this.message)).stack;
    } else {
      Error.captureStackTrace(this, MissingLocalizationError);
    }
  }

  buildMessage = () => {
    this.message = this.requests.map((request) => {
      if (request.name === request.value) {
        return `Missing localization: ${request.name}`;
      }
      return `Missing localization: (${request.name}) ${request.value}`;
    }).join('\n');
  };

  add = (name, value) => {
    for (let i = 0; i < this.requests.length; i++) {
      if (this.requests[i].name === name) {
        return;
      }
    }
    this.requests.push({ name, value });
    this.buildMessage();
  };
}
