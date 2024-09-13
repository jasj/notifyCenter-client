const sendNotification = require("./modules/notificationClient");

  const notifications = [
    {
      to: ['87065014',"andres@segreda.com","gcruz@csye.com","88438737"],
      subject: 'Confirmación de Pedido '+Math.random()*10000000,
      template: 'order_confirmation',
      payload: {
        nombre: "Andres",
        fecha: new Date().getTime(),
        email:"paco@pico.com",
        productos: [
          { id: 3, precio: 5000, vendedor: "andres@segreda.com" ,codigo: "JSJ333"},
          { id: 7, precio: 3500,vendedor: "andres@segreda.com"  ,codigo: "454545"}
        ],
        total: 8500
      }
    }
  ];

  
  sendNotification(notifications)