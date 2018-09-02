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
  })
};

VistaItems.prototype = {
  inicializar: function() {
    this.configuracionDeBotones();
  },

  configuracionDeBotones: function(){
    var contexto = this;

    $("button.add-to-wishlist").click(function() {
      var id = $(this).closest("div.product").attr("id");
      contexto.controlador.addToWishlist(id);
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