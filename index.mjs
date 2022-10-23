'use strict';
import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask } from '@reach-sh/stdlib';
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


const standarUnitStr = stdlib.standardUnit;
const atomicUnitStr = stdlib.atomicUnit;
console.log(`La unidad estándar es ${standarUnitStr} `);
console.log(`La unidad atómica es ${atomicUnitStr} `);

// Convierte el Standar Unit a  Atomic Unit
const toAtomicUnit = (standarUnit) => stdlib.parseCurrency(standarUnit);

// Convierte el  Atomic Unit a  Standar Unit
const toStandarUnit = (atomicUnit) => stdlib.formatCurrency(atomicUnit, 4);

// Standar Unit Balance
const standarBalance = 1000;
const iBalance = toAtomicUnit(standarBalance);

// console.log(`El balance es: ${standarBalance} ${standarUnitStr}`);

// const atomicBalance = toAtomicUnit(standarBalance);
// console.log(`El balance atomico es: ${atomicBalance} ${atomicUnitStr}`);
// console.log(`El balance standard es: ${toStandarUnit(atomicBalance)} ${standarUnitStr}`);

const showBalance = async (acc) => {
  const standarUnitBalance = toStandarUnit(await stdlib.balanceOf(acc))
  console.log(`Tu balance actual es: ${standarUnitBalance} ${standarUnitStr}.`);
}



const commonInteract = {};

if (role === 'seller') {
  console.log("🛍 seller 🛍");
  // se le agrega la interaccion que tendra el seller
  const sellerInteract = {
    ...commonInteract,
    price: toAtomicUnit(5),
    reportReady: async (price) => {
      console.log(`Tu sabiduría está a la venta en ${toStandarUnit(price)} ${standarUnitStr}.`);
      console.log(`Informacion del contrato: ${JSON.stringify(await ctc.getInfo())}`);
    },
  };

  // crea una cuenta al seller con 1000 ALGOS
  const acc = await stdlib.newTestAccount(iBalance);
  // obtengo una referencia al contracto
  const ctc = acc.contract(backend);
  // muestro el balance antes de ejecutar el contracto
  await showBalance(acc); //mostrara 1000 ALGO
  // se inicia una interaccion con el contrato del seller
  await ctc.participants.Seller(sellerInteract);
  // muestro el balance actual del seller despues del contracto
  await showBalance(acc); // mostrara 999.996 ALGO
} else {
  // Buyer
  console.log("👨 Buyer 👨");

  const buyerInteract = {
    ...commonInteract,
    // pregunta para confirmar el pago
    confirmPurchase: async (price) => await ask.ask(`Quieres comprar sabiduria por: ${toStandarUnit(price)} ${standarUnitStr}?`, ask.yesno),
  };
  // crea la cuenta del buyer con 1000 algos
  const acc = await stdlib.newTestAccount(iBalance);
  // solicita pegar en formato json el contrato para conectarme
  const info = await ask.ask('Pegar información del contrato:', (s) => JSON.parse(s));
  // lee el contrato y le pasa la info de cual especificamente
  const ctc = acc.contract(backend, info);
  // muestra el balance del buyer antes de la transaccion
  await showBalance(acc);
  // ejecuta la interaccion
  await ctc.p.Buyer(buyerInteract);
  // muestra el balance despues de la transaccion
  await showBalance(acc);
};

ask.done();