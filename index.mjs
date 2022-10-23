import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
// definicion de rol principal obteniendolo de las los argumentos por consola
if (process.argv.length < 3 || ['seller', 'buyer'].includes(process.argv[2]) == false) {
  console.log('Usage: reach run index [seller|buyer]');
  process.exit(0);
}
const role = process.argv[2];
console.log(`Your role is ${role}`);

// me coneacto a la red de ALGORAND
const stdlib = loadStdlib(process.env);
// console.log(process.env);
// const stdlib = loadStdlib('fb449c94');
console.log(`The consensus network is ${stdlib.connector}.`);


const commonInteract = {};

if (role === 'seller') {
  console.log("soy un seller!!");
  const sellerInteract = {
    ...commonInteract,
  };
  // crea una cuenta al seller con 1000 ALGOS
  const acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  // obtengo una referencia al contracto
  const ctc = acc.contract(backend);
  // se inicia una interaccion con el contrato del seller
  await ctc.participants.Seller(sellerInteract);

} else {
  // Buyer
  const buyerInteract = {
    ...commonInteract,
  };
};