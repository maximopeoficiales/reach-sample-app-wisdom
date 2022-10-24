'reach 0.1';
const commonInteract = {
  reportCancellation: Fun([], Null),
  reportPayment: Fun([UInt], Null),
  reportWisdom: Fun([Bytes(128)], Null),
  reportTransfer: Fun([UInt], Null)

};

// se le indica el contracto que realizara el seller 
const sellerInteract = {
  ...commonInteract,
  // Sera entero
  price: UInt,
  wisdom: Bytes(128),
  // sera una funcion que recibira un parametro de tipo entero y no devolvera nada
  reportReady: Fun([UInt], Null),
};
const buyerInteract = {
  ...commonInteract,
  confirmPurchase: Fun([UInt], Bool)
};

// crea una instancia para iniciar una aplicacion standard
export const main = Reach.App(() => {
  /* 
  Creo dos participantes 
  seller => vendedor
  buyer => comprador
  */
  const SELLER = Participant('Seller', sellerInteract);
  const BUYER = Participant('Buyer', buyerInteract);

  init();
  // obtiene y setea el precio de la transaccion
  SELLER.only(() => { const price = declassify(interact.price); });
  SELLER.publish(price);
  // ejecuta la funcion de sellerInteract =>  reportReady de index.mjs y le pasa el parametro
  SELLER.interact.reportReady(price);
  commit();

  // interactua con el precio de la transaccion del  y ejecuta la funcion de confirmacion
  BUYER.only(() => { const willBuy = declassify(interact.confirmPurchase(price)); });
  BUYER.publish(willBuy);
  if (!willBuy) {
    commit();
    each([SELLER, BUYER], () => interact.reportCancellation());
    exit();
  } else {
    commit();
  }
  // el comprador paga el precio
  BUYER.pay(price);
  // notifica a los participantes sobre el pago
  each([SELLER, BUYER], () => interact.reportPayment(price));
  commit();
  // dispone la sabidurita el seller al comprador
  SELLER.only(() => { const wisdom = declassify(interact.wisdom); });
  SELLER.publish(wisdom);
  // transfiere los fondos
  transfer(price).to(SELLER);
  commit();
  // notifica a los participantes sobre la transferencia ejecutada
  each([SELLER, BUYER], () => interact.reportTransfer(price));

  exit();
});