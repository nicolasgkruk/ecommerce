/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  addToWishlist: function(productID) {
    if (!this.modelo.whishList.includes(productID)){
      this.modelo.addToWishlist(productID);
    } else {
      this.modelo.removeFromWishlist(productID);
    }
  },
  obtenerWishlist: function() {
  	this.modelo.recibe();
  },

  obtenerCartList: function() {
    this.modelo.enviarCartList();
  },

  addToCart: function(id) {
    this.modelo.addToCart(id);
  },

  removeFromCart: function(id) {
    this.modelo.removeFromCart(id);
  },

  sendCredentials: function(user, pass) {
    this.modelo.getCredentials(user, pass);
  },

  getProductList: function() {
    this.modelo.sendProductList();
  }
};
