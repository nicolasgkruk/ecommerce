/*
 * Modelo
 */
var Modelo = function() {
  this.productList = []
  this.whishList = [];  
  this.cartList = [];
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
  addToWishlist: function(productID) {
    this.whishList.push(productID);
    this.itemAgregadoAWhishList.notificar(productID);
    this.guardar();
  },

  removeFromWishlist: function(productID){
    var index = this.whishList.indexOf(productID);
    if (index > -1) {
      this.whishList.splice(index, 1);
      this.itemEliminadoDeWhishList.notificar(productID);
      this.guardar();
    }
  },
  //se guardan en el local storage
  guardar: function(){
      var wishlist = this.whishList;
      var str = JSON.stringify(wishlist);
      localStorage.setItem('wishlist', str);
  },

  guardarCart: function() {
    var cartList = this.cartList;
    var str = JSON.stringify(cartList);
    localStorage.setItem("cartList", str);
  },
  // recibe
   recibe: function(){     
      var strItem = localStorage.getItem('wishlist');
      this.whishList = JSON.parse(strItem);
      if(this.whishList === null) {
        this.whishList = [];
      } else {
        this.itemGuardado.notificar(this.whishList);        
      }
  },

  generarCartListDropDown: function() {
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
  },


  enviarCartList: function() {
    var strItem = localStorage.getItem("cartList");
    this.cartList = JSON.parse(strItem);
    if(this.cartList === null) {
      this.cartList = [];
    }
    this.cartListLoaded.notificar(this.generarCartListDropDown());
  },

  addToCart: function(id) {
    var cartList = this.cartList;
    cartList.push(id);
    this.guardarCart();
    this.itemAddedToCart.notificar(this.generarCartListDropDown())
  },

  removeFromCart: function(id) {
    this.cartList = this.cartList.filter(function(item) { return item !== id });
    this.guardarCart();
    this.removedFromCart.notificar(this.generarCartListDropDown())
  },

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
        url: "http://ecommerce.casu-net.com.ar/api/products",
        headers: { "x-access-token": context.token }
      })
      .done(function(body) {
        console.log(body)
        context.whishList = body;
        //TODO this.wishListLoaded.notificat(wishList);
      });
      // retrieveCartList
      $.ajax({
        method: "GET",
        url: "http://ecommerce.casu-net.com.ar/api/cart",
        headers: { "x-access-token": context.token }
      })
      .done(function(body) {
        console.log(body);
        context.cartList = body;
        //TODO this.cartListLoaded.notificar(productList);
      });
    //TODO this.loginDone.notificar(username);
    });
  },

  sendProductList: function() {
    $.ajax({
      method: "GET",
      url: "http://ecommerce.casu-net.com.ar/api/products",
      headers: { "x-access-token": "TOKEN" }
    })
    .done(function( msg ) {
      console.log(msg)
      //TODO this.listOfProductsLoaded.notificar(productList);
    });
  }
};
 

