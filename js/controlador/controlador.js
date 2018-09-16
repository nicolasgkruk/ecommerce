/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {

  addToWishlist: function(productID) {
    this.modelo.addToOrRemoveFromWishList(productID);
  },

  obtenerWishlist: function() {
  	this.modelo.sendWishList();
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
  },

  retrieveUserSession: function() {
    this.modelo.loadSession();
  }
};
