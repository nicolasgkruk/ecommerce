var VistaCart = function(modelo, controlador) {
  this.modelo = modelo;
  this.controlador = controlador;
  var contexto = this;

  this.modelo.itemAddedToCart.suscribir(function(modelo, listaCart){
    contexto.actualizarContador(listaCart);
    contexto.actualizarDropDown(listaCart);
  });

  this.modelo.cartListLoaded.suscribir(function(modelo, listaCart) {
    contexto.actualizarContador(listaCart);
    contexto.actualizarDropDown(listaCart);
  });

  this.modelo.removedFromCart.suscribir(function(modelo, listaCart) {
    contexto.actualizarContador(listaCart);
    contexto.actualizarDropDown(listaCart);
  });

};

VistaCart.prototype = {
  inicializar: function() {
    this.controlador.obtenerCartList()
    this.configuracionDeBotones();
  },

  actualizarContador: function(listaCart) {
    var cartDiv = $(".dropdown-toggle")

    var totalAmount = function(){
      var total = 0;
      for (var i = 0; i < listaCart.length; i++) {
             total += listaCart[i].cantidad;
           }
      return total;
    }; 
    cartDiv.find("div.qty").html(totalAmount());
  },

  actualizarDropDown: function(listaCart) {
    var cartList = $(".cart-list");
    cartList.html("");
    listaCart.forEach(function(product) {
      cartList.append(`<div class="product-widget" id="${product.id}">
      <div class="product-img">
        <img src="./img/${product.image}" alt="">
      </div>
      <div class="product-body">
        <h3 class="product-name"><a href="#">${product.name}</a></h3>
        <h4 class="product-price"><span class="qty">${product.cantidad}x</span>$ ${product.precio}</h4>
      </div>
      <button class="delete"><i class="fa fa-close"></i></button>
    </div>`);
    })

    this.configuracionDeBotones();
  },

  configuracionDeBotones: function(){
    var contexto = this;

    $("button.delete").click(function() {
      var id = $(this).closest("div.product-widget").attr("id");
      contexto.controlador.removeFromCart(id);
    });
  },
}
