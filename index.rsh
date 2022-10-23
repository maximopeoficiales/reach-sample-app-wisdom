'reach 0.1';
const commonInteract = {};
const sellerInteract = {
  ...commonInteract,
};
const buyerInteract = {
  ...commonInteract,
};

// crea una instancia para iniciar una aplicacion standard
export const main = Reach.App(() => {
  /* 
  Creo dos participantes 
  seller => vendedor
  buyer => comprador
  */
  const S = Participant('Seller', sellerInteract);
  const B = Participant('Buyer', buyerInteract);
  init();
  exit();
});