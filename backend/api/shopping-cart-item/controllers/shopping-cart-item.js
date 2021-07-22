const {  sanitizeEntity } = require('strapi-utils');
module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async updatequantity(ctx, data) {
    const { id } = ctx.params

    const entry = await strapi.query('shopping-cart-item').update({id}, ctx.request.body);
    
    return entry;
  },
};
