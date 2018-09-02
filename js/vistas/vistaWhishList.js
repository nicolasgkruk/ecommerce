var VistaWishList = function(modelo, controlador) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.cantidad = 0;
  var contexto = this;

  // suscripción de observadores
  this.modelo.itemAgregadoAWhishList.suscribir(function() {
    contexto.incrementarContador();
  });

  this.modelo.itemEliminadoDeWhishList.suscribir(function() {
    contexto.decrementarContador();
  });
  this.modelo.itemGuardado.suscribir(function(modelo, listaWishlist){
    contexto.actualizarContador(listaWishlist);
  })
};


VistaWishList.prototype = {
  inicializar: function() {
    this.controlador.obtenerWishlist()
  },

  incrementarContador: function(){
    this.cantidad++;
    $("#wishlist-qty").html(this.cantidad)
  },

  decrementarContador: function(){
    this.cantidad--;
    $("#wishlist-qty").html(this.cantidad)
  },

  actualizarContador: function(listaWishlist){
    this.cantidad = listaWishlist.length;
    $("#wishlist-qty").html(this.cantidad)
  },
};
