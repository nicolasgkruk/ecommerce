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

  this.modelo.loginDone.suscribir(function(modelo, user) {
    // TODO fire welcome message, hide login form.
  });

};

VistaCart.prototype = {
  inicializar: function() {
    this.configuracionDeBotones();
  },

  actualizarContador: function(listaCart) {
    var cartDiv = $(".dropdown-toggle");
    var totalAmount = function(){
      var cantidadTotal = 0;
      var subtotal = 0;
      var elemento = document.getElementById("subtotal");
      for (var i = 0; i < listaCart.length; i++) {
        cantidadTotal += listaCart[i].qty;
        subtotal += listaCart[i].product.price * listaCart[i].qty;
        elemento.innerHTML = "SUBTOTAL: $" + subtotal;
        }
      
      if (listaCart.length < 1) {
        elemento.innerHTML = "";
      } 
      return cantidadTotal;
    }; 
    cartDiv.find("div.qty").html(totalAmount());
  },

  actualizarDropDown: function(listaCart) {
    var cartList = $(".cart-list");
    cartList.html("");
    var $template = $('div.product-widget');
    listaCart.forEach(function(e) {
      //desde aca llamamos al Template
      // clonamos el Template
      var $clone = $template.clone();
      // sacamos la clase hide
      $clone.removeClass('hide');
      // le insertamos el texto del producto al template clonado
      $clone.attr("id", e.product._id);
      $clone.find("h3.product-name a").text(e.product.name);
      $clone.find("div.product-img img").attr("src", e.product.pictureUrl);
      //$clone.find("h4.product-price").text(`x ${product.cantidad} - ${product.precio} `);
      var html = $clone.find("h4.product-price").html()
      html = html.replace("{productName}", e.product.name)
      html = html.replace("{qty}", e.qty)
      html = html.replace("{price}", e.product.price)
      $clone.find("h4.product-price").html(html)
      // agregamos el template a cart-list
      cartList.append($clone);
    });
    this.configuracionDeBotones();
  },

  configuracionDeBotones: function(){

   /*  var borrar = document.getElementById("borrate");
    if(listaCart == null || listaCart.length == 0) {
      borrar.style.display = "none";
    } else {
      borrar.style.display = "block";
    }; */

    var contexto = this;

    $("button.delete").click(function() {
      var id = $(this).closest("div.product-widget").attr("id");
      contexto.controlador.removeFromCart(id);
    });

    $("button#login").click(function() {
      var user = $(this).closest("div.container").find("input[name='username']").val();
      var pass = $(this).closest("div.container").find("input[name='password']").val();
      contexto.controlador.sendCredentials(user, pass);

      // TODO: Input Validation and relocate to click span inside login button on header.
    });

    // TODO: Register

  },

}
