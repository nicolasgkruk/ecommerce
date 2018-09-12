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
   
    var cartDiv = $(".dropdown-toggle");

    var totalAmount = function(){
      var total = 0;
      var subtotal = 0;
      var elemento = document.getElementById("subtotal");
      for (var i = 0; i < listaCart.length; i++) {
             total += listaCart[i].cantidad;
             subtotal += listaCart[i].precio * listaCart[i].cantidad;
             elemento.innerHTML = "SUBTOTAL: $" + subtotal;
           }
      
      if (listaCart.length < 1) {
        elemento.innerHTML = "";
      } 
      return total;
    }; 
    cartDiv.find("div.qty").html(totalAmount());
  },

  actualizarDropDown: function(listaCart) {
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

     /*  cartList.append(`<div class="product-widget" id="${product.id}">
      <div class="product-img">
        <img src="./img/${product.image}" alt="">
      </div>
      <div class="product-body">
        <h3 class="product-name"><a href="#">${product.name}</a></h3>
        <h4 class="product-price"><span class="qty">${product.cantidad}x</span>$ ${product.precio}</h4>
      </div>
      <button class="delete"><i class="fa fa-close"></i></button>
    </div>`);
    }); */

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
  },
}
