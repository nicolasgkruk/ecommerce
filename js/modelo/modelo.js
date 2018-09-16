/*
 * Modelo
 * 
 * TODO:
-retrieve token when page reloads
-register new user. update view accordingly.
-ocultar wish list y cart hasta que se loguee?
-registrar cart y wishlist 
-sign in, remove sign in form after sign in.
-add, remove from cart.
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
      var filteredWishList = wishList.find(function(element) {
      return element._id === productID
      });
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
      }
      else if (filteredWishList._id === productID) {
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
    // if product in getwishlist: remove
    // else if product not in wishlist: addToWishlist
  },

  //se guardan en el local storage
  sendWishList: function(){     


      /* var strItem = localStorage.getItem('wishlist');
      this.whishList = JSON.parse(strItem);
      if(this.whishList === null) {
        this.whishList = [];
      } else {
        this.itemGuardado.notificar(this.whishList);        
      } */
  },

  /* generarCartListDropDown: function() {
    var cartList = this.cartList;
    var productList = this.productList;
    var cartListDropDown = [];
    var copy = cartList.slice(0);
    for (var i = 0; i < cartList.length; i++) {
      var contador = 0;	
      // loop over every element in the cartList and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (cartList[i] == copy[w]) {
          // increase amount of times duplicate is found
          contador++;
          // sets item to undefined
          delete copy[w];
        };
      };
      if (contador > 0) {
        var item = new Object();
        item.id = cartList[i];
        item.cantidad = contador;
        cartListDropDown.push(item);
      };

    };
    
    for (var i = 0; i < cartListDropDown.length; i++) {
      for (var z = 0; z < productList.length; z++) {
        if (cartListDropDown[i].id === productList[z].id) {
          cartListDropDown[i].image = productList[z].image;
          cartListDropDown[i].name = productList[z].name;
          cartListDropDown[i].precio = productList[z].newPrice;
        }
      }
    }

    return cartListDropDown;
  }, */


 /*  enviarCartList: function() {
    var strItem = localStorage.getItem("cartList");
    this.cartList = JSON.parse(strItem);
    if(this.cartList === null) {
      this.cartList = [];
    }
    this.cartListLoaded.notificar(this.generarCartListDropDown());
  }, */

  /* addToCart: function(id) {
    // TODO: everything.
    var cartList = this.cartList;
    cartList.push(id);
    this.guardarCart();
    this.itemAddedToCart.notificar(this.generarCartListDropDown())
  }, */

  /* removeFromCart: function(id) {
    // TODO:
    this.cartList = this.cartList.filter(function(item) { return item !== id });
    this.guardarCart();
    this.removedFromCart.notificar(this.generarCartListDropDown())
  }, */

  getCredentials: function(user, pass) {
    var context = this;
    $.ajax({
      method: "POST",
      url: "http://ecommerce.casu-net.com.ar/api/users/authenticate",
      data: { email: user, password: pass }
    })
    .done(function( body ) {
      console.log(body.token);
      // changeToken and save to local storage
      context.token = body.token;
      localStorage.setItem('token', context.token);
      // retrieveWishList
      $.ajax({
        method: "GET",
        url: "http://ecommerce.casu-net.com.ar/api/whishlist",
        headers: { "x-access-token": context.token }
      })
      .done(function(body) {
        context.whishList = body;
        context.wishListLoaded.notificar(context.whishList);
      });
      // retrieveCartList
      $.ajax({
        method: "GET",
        url: "http://ecommerce.casu-net.com.ar/api/cart",
        headers: { "x-access-token": context.token }
      })
      .done(function(body) {
        console.log("Cart is currently" + body.length);
        context.cartList = body;
        //TODO: this.cartListLoaded.notificar(productList);
      });
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
  }
};

