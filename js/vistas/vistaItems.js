var VistaItems = function(modelo, controlador) {
  this.modelo = modelo;
  this.controlador = controlador;
  var contexto = this;

  // suscripción de observadores
  this.modelo.itemAgregadoAWhishList.suscribir(function(modelo, productID) {
    contexto.prenderCorazon(productID);
  });

  this.modelo.itemEliminadoDeWhishList.suscribir(function(modelo, productID) {
    contexto.apagarCorazon(productID);
  });
  this.modelo.itemGuardado.suscribir(function(modelo, listaWishlist){
    contexto.prenderTodos(listaWishlist);
  });

  this.modelo.listOfProductsLoaded.suscribir(function(modelo, listOfProducts) {
    contexto.productsLoaded(listOfProducts);
  });

  this.modelo.wishListLoaded.suscribir(function(modelo, listaWishlist) {
    contexto.prenderTodos(listaWishlist);
  })
};

VistaItems.prototype = {
  inicializar: function() {
    this.configuracionDeBotones();
    controlador.getProductList();
    controlador.retrieveUserSession();
  },

  productsLoaded: function(products) {
    var $storeDiv = $("#store");
    $storeDiv.html("");
    var $template = $('div.product-template');
    //$storeDiv.append($("div")).addClass("row");
    products.forEach(function(product) {
      //desde aca llamamos al Template
      // clonamos el Template
      var $clone = $template.clone();
      // sacamos la clase hide
      $clone.removeClass('hide');
      // le insertamos el texto del producto al template clonado
      $clone.attr("id", product._id);
      $clone.find("h3.product-name a").text(product.name);
      $clone.find("div.product-img img").attr("src", product.pictureUrl);
      var html = $clone.find("h4.product-price").html();
      html = html.replace("{price}", product.price);
      html = html.replace("{oldPrice}", product.oldPrice)
      $clone.find("h4.product-price").html(html)
      // agregamos el template a cart-list
      $storeDiv.append($clone);
    });
    this.configuracionDeBotones();
  },

  configuracionDeBotones: function(){
    var contexto = this;

    $("button.add-to-wishlist").click(function() {
      var id = $(this).closest("div.product-template").attr("id");
      contexto.controlador.addToWishlist(id);
    });

    $("button.add-to-cart-btn").click(function() {
      var id = $(this).closest("div.product-template").attr("id");
      contexto.controlador.addToCart(id);
    });
  },

  prenderCorazon: function(productID){
    $("div#" + productID).find("button.add-to-wishlist i").addClass('fa-heart').removeClass('fa-heart-o');
    $("div#" + productID).find("span.tooltipp").html('remove from wishlist');
  },

  prenderTodos: function(listaWishlist) {
    for(var i = 0; i < listaWishlist.length; i++ ) {
      this.prenderCorazon(listaWishlist[i]._id);  
    }
  },

  apagarCorazon: function(productID){
    $("div#" + productID).find("button.add-to-wishlist i").addClass('fa-heart-o').removeClass('fa-heart');
    $("div#" + productID).find("span.tooltipp").html('add to wishlist');
  }
};