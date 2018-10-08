/*
 * Modelo
 * 
 * TODO:
-if no one is logged and no token is saved: alert when adding cart or wish list (send person to login)
-cerrar sesión (borra token y recarga vista)
-register new user. update view accordingly.
-sign in, remove sign in form after sign in.
-errors, exceptions from all ajax calls.
-loader icon?
-remove icon from cart: deletes item.
 */

var Modelo = function() {
  this.token = "";
  //inicializacion de eventos
  this.itemAgregadoAWhishList = new Evento(this);
  this.itemEliminadoDeWhishList = new Evento(this);
  this.itemGuardado = new Evento(this);
  this.itemAddedToCart = new Evento(this);
  this.cartListLoaded = new Evento(this);
  this.removedFromCart = new Evento(this);
  this.wishListLoaded = new Evento(this);
  this.loginDone = new Evento(this);
  this.listOfProductsLoaded = new Evento(this);
};

Modelo.prototype = {
  retrieveWishList: function() {
    var context = this;
    $.ajax({
      method: "GET",
      url: "http://ecommerce.casu-net.com.ar/api/whishlist",
      headers: { "x-access-token": this.token }
    })
    .done(function(body) {
      context.wishListLoaded.notificar(body);
    });
  },

  retrieveCartList: function() {
    var context = this;
    $.ajax({
      method: "GET",
      url: "http://ecommerce.casu-net.com.ar/api/cart",
      headers: { "x-access-token": this.token }
    })
    .done(function(body) {
      context.cartListLoaded.notificar(body);
    });
  },  

  addToOrRemoveFromWishList: function(productID) {
    var context = this;
    // getwishlist
    $.ajax({
      method: "GET",
      url: "http://ecommerce.casu-net.com.ar/api/whishlist",
      headers: { "x-access-token": context.token }
    })
    .done(function(body) {
      var wishList = body;
      // find element from returned wishlist that matches with productID
      var filteredWishList = wishList.find(function(element) {
      return element._id === productID
      });
      // if there is no product with that id, then add it to wishlist
      if (filteredWishList == undefined || !filteredWishList) {
        $.ajax({
          method: "POST",
          url: "http://ecommerce.casu-net.com.ar/api/whishlist",
          headers: {  "x-access-token": context.token },
          data: {
            productId: productID,
          }
        })
        .done(function(body) {
          console.log(body)
          context.itemAgregadoAWhishList.notificar(productID);
        })
      // else if there is a product then remove it instead
      } else if (filteredWishList._id === productID) {
        var deleteUrl = "http://ecommerce.casu-net.com.ar/api/whishlist/"
        var fullDeleteUrl = deleteUrl.concat(productID);
        $.ajax({
          method: "DELETE",
          url: fullDeleteUrl,
          headers: {  "x-access-token": context.token },
          data: {
            productId: productID,
          }
        })
        .done(function(body) {
          console.log(body)
          context.itemEliminadoDeWhishList.notificar(productID);
        })
        .error(function(body) {
          var response = body;
          console.log(response.statusText);
        })
      }
    });
  },

  addToCart: function(productID) {
    var context = this;
      $.ajax({
        method: "POST",
        url: "http://ecommerce.casu-net.com.ar/api/cart/",
        headers: {  "x-access-token": context.token },
        data: {
          productId: productID,
          qty: 1
          }
        })
        .done(function(body) {
          console.log(body)
          context.itemAddedToCart.notificar(body);
        })
  },

  removeFromCart: function(productID) {
    var context = this;
    var route = "http://ecommerce.casu-net.com.ar/api/cart/";
    var fullRoute = route.concat(productID);
      $.ajax({
        method: "DELETE",
        url: fullRoute,
        headers: {  "x-access-token": context.token },
        data: {
          productId: productID,
          }
        })
        .done(function(body) {
          console.log(body)
          context.removedFromCart.notificar(body);
        })
  },

  getCredentials: function(user, pass) {
    var context = this;
    $.ajax({
      method: "POST",
      url: "http://ecommerce.casu-net.com.ar/api/users/authenticate",
      data: { email: user, password: pass }
    })
    .done(function(body) {
      console.log(body.token);
      // changeToken and save to local storage
      context.token = body.token;
      localStorage.setItem('token', context.token);
      context.retrieveWishList();
      context.retrieveCartList();
    //TODO: this.loginDone.notificar(username);
    });
  },

  sendProductList: function() {
    var contexto = this;
    $.ajax({
      method: "GET",
      url: "http://ecommerce.casu-net.com.ar/api/products",
    })
    .done(function(body) {
      contexto.listOfProductsLoaded.notificar(body);
    });
  },

  loadSession: function() {
    this.token = localStorage.getItem('token');
    if (this.token) {
    this.retrieveWishList();
    this.retrieveCartList();
    }
  }
};