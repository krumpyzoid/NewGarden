const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
  /**
   * Promise to edit record
   *
   * @return {Promise}
   */

  async updatequantity(params, data) {
    const existingEntry = await strapi.query('shopping-cart-item').findOne(params);

    const isDraft = isDraft(existingEntry, strapi.models.shopping_cart_item);
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.shopping_cart_item,
      data,
      { isDraft }
    );

    const entry = await strapi.query('shopping-cart-item').update(params, validData);

    return entry;
  },
};
