const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:card');

module.exports = class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find (params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);

    if (!query.type) {
      query.type = 'bank_account';
    }

    return this.stripe.customers.listSources(params.customer, query).catch(errorHandler);
  }

  get (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.retrieveSource(params.customer, id).catch(errorHandler);
  }

  create (data, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.createSource(params.customer, data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.updateCard(params.customer, id, data).catch(errorHandler);
  }

  remove (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(params.customer, id).catch(errorHandler);
  }
};