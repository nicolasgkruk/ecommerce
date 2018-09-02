/*
 * Modelo
 */
var Modelo = function() {
  this.productList = [{id: "product1", image: "product01.png", name:"MacBook Pro", oldPrice: 35000, newPrice: 30000},
  {id: "product2", image: "product05.png", name:"Auriculares Sony", oldPrice: 2650, newPrice: 2500},
  {id: "product3", image: "product04.png", name:"Tablet Xperia", oldPrice: 6000 , newPrice: 5600 },
  {id: "product4", image: "product06.png", name:"Notebook MSI", oldPrice: 9000, newPrice: 8500},
  {id: "product5", image: "product07.png", name:"Smartphone Samsung", oldPrice: 8000, newPrice: 7500},
  {id: "product6", image: "product09.png", name:"Rekam", oldPrice: 990, newPrice: 980},]
  this.whishList = [];  
  this.cartList = [];

  //inicializacion de eventos
  this.itemAgregadoAWhishList = new Evento(this);
  this.itemEliminadoDeWhishList = new Evento(this);
  this.itemGuardado = new Evento(this);
  this.itemAddedToCart = new Evento(this);
  this.cartListLoaded = new Evento(this);
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
  }
};
 

