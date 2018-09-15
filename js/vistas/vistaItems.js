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
    contexto.productsLoaded(products);
  });
};

VistaItems.prototype = {
  inicializar: function() {
    this.configuracionDeBotones();
  },

  productsLoaded: function(products) {
    var cartList = $(".cart-list");
    cartList.html("");
    listaCart.forEach(function(product) {
      //desde aca llamamos al Template
      var $template = $('div.product-widget');
      // clonamos el Template
      var $clone = $template.clone();
      // sacamos la clase hide
      $clone.removeClass('hide');
      // le insertamos el texto del producto al template clonado
      $clone.attr("id", product.id);
      $clone.find("h3.product-name a").text(product.name);
      $clone.find("div.product-img img").attr("src", './img/' + product.image);
      //$clone.find("h4.product-price").text(`x ${product.cantidad} - ${product.precio} `);
      var html = $clone.find("h4.product-price").html()
      html = html.replace("{productName}", product.name)
      html = html.replace("{qty}", product.cantidad)
      html = html.replace("{price}", product.precio)
      $clone.find("h4.product-price").html(html)
      // agregamos el template a cart-list
      cartList.append($clone);
    });
    this.configuracionDeBotones();
  },

  configuracionDeBotones: function(){
    var contexto = this;

    $("button.add-to-wishlist").click(function() {
      var id = $(this).closest("div.product").attr("id");
      contexto.controlador.addToWishlist(id);
    });

    $("button.add-to-cart-btn").click(function() {
      var id = $(this).closest("div.product").attr("id");
      contexto.controlador.addToCart(id);
    });
  },

  prenderCorazon: function(productID){
    $("div#" + productID).find("button.add-to-wishlist i").addClass('fa-heart').removeClass('fa-heart-o');
    $("div#" + productID).find("span.tooltipp").html('remove from wishlist');
  },

  prenderTodos: function(listaWishlist) {
    for(var i = 0; i < listaWishlist.length; i++ ) {
      this.prenderCorazon(listaWishlist[i]);  
    }
  },

  apagarCorazon: function(productID){
    $("div#" + productID).find("button.add-to-wishlist i").addClass('fa-heart-o').removeClass('fa-heart');
    $("div#" + productID).find("span.tooltipp").html('add to wishlist');
  }
};