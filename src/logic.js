// @flow

export type Player = 'Red' | 'Yellow' | 'Green' | 'Blue';

// TODO: Restrict?
export type CompanyName = string;

export type Shareholder = Player | 'Bank'

export type Payee = Shareholder | CompanyName;

export type Company = {
  name: CompanyName,
  basePrice: number
};

export type RawPayment = {
  kind: 'raw',
  total: number,
};

export type GoodsPayment = {
  kind: 'goods',
  total: number,
  unitPrice: number,
  goodsSold: number,
  halfPriceGoodsSold: number,
  bonusTwenty: boolean,
  bonusFifty: boolean,
}

export type Payment = RawPayment | GoodsPayment;

export type OperatingRound = {
  // Copied because it changes round to round
  // and the base price can change round to round
  companies: Company[];
  // companyName -> playerName -> numShares
  shares: {[CompanyName]: {[Shareholder]: number}},
  // companyName -> Payment
  payments: {[string]: Payment},
};

export type Game = {
  players: Player[],
  currentRound: number,
  rounds: OperatingRound[],
  alert: string,
};

function copy(x: any): any{
  return JSON.parse(JSON.stringify(x));
}

function newRound(companies: Company[], shares: {[CompanyName]: {[Shareholder]: number}}): OperatingRound {
  return {
    companies: copy(companies),
    shares: copy(shares),
    payments: {},
  };
}

export function newGame(players: Player[] = ['Red','Green','Yellow','Blue']): Game{
  return {
    players: players,
    currentRound: 1,
    rounds: [newRound([], {})],
  };
};

export function clearAlert(game: Game): Game{
  let res = copy(game);
  res.alert = null;
  return res;
};

export function prevRound(game: Game): Game{
  let res = copy(game);
  if(res.currentRound === 1)
    return res;
  res.currentRound--;
  return res;
};

export function nextRound(game: Game): Game{
  let res = copy(game);
  let curRound = res.rounds[res.currentRound - 1];
  // Create a new round if either there is no round at the
  // place we're trying to move, or if there is no payments
  // in the new round (in this case, we're assuming that the
  // players changed something in the previous round and we
  // should re-copy over those changes into the next round)
  const existing = res.rounds[res.currentRound];
  const isExistingEmpty = existing && existing.payments.length === 0;
  const isNewRound = res.currentRound === res.rounds.length;
  if(isExistingEmpty)
    res.alert = `Round ${res.currentRound+1} had no payments, so we reset it with share/payment info from round ${res.currentRound}`;

  if(isExistingEmpty || isNewRound)
    res.rounds[res.currentRound] = newRound(curRound.companies, curRound.shares);
  res.currentRound++;
  return res;
};

export function newCompany(game: Game, newCompany: Company): Game{
  let res = copy(game);
  let curRound = res.rounds[res.currentRound-1];
  curRound.companies.push(newCompany);
  curRound.shares[newCompany.name] = {};
  return res;
};

export function removeCompany(game: Game, companyName: string): Game{
  let res = copy(game);
  let curRound = res.rounds[res.currentRound-1];
  curRound.companies = curRound.companies.filter(c => c.name !== companyName);
  curRound.shares[companyName] = undefined;
  return res;
}

export function setPayment(game: Game, companyName: string, payment?: Payment): Game{
  let res = copy(game);
  let curRound = res.rounds[res.currentRound-1];
  if(payment == null){ 
    curRound.payments[companyName] = undefined;
  } else {
    curRound.payments[companyName] = payment;
    // If we are setting a goods price, check if we changed the
    // company base price
    if(payment.kind === 'goods'){
      let c = curRound.companies.filter(c => c.name === companyName)[0];
      c.basePrice = payment.unitPrice;
    }
  }
  return res;
}

export function setShares(game: Game, companyName: string, shareholder: Shareholder, numShares: number): Game{
  if(numShares < 0) numShares = 0;
  if(numShares > 10) numShares = 10;
  let res = copy(game);
  let curRound = res.rounds[res.currentRound-1];
  curRound.shares[companyName][shareholder] = numShares;
  return res;
}

export function countShares(game: Game, companyName: string, shareholder: Shareholder): number{
  return game.rounds[game.currentRound-1].shares[companyName][shareholder] || 0;
}

export function countOwnedShares(game: Game, companyName: string): number{
  const shares = game.rounds[game.currentRound-1].shares[companyName];
  return shares.values().reduce((a,b) => a + b, 0);
}

export function incShares(game: Game, companyName: string, shareholder: Shareholder): Game{
  const curShares = countShares(game, companyName, shareholder);
  const ownedShares = countOwnedShares(game, companyName);
  if(ownedShares > 9)
    return game;
  return setShares(game, companyName, shareholder, curShares + 1);
}

export function decShares(game: Game, companyName: string, shareholder: Shareholder): Game{
  const curShares = countShares(game, companyName, shareholder);
  if(curShares < 1)
    return game;
  return setShares(game, companyName, shareholder, curShares - 1);
}

function paymentTotal(payment: Payment): number{
  if(payment.kind === 'raw'){
    return payment.total;
  } else {
    return (payment.unitPrice * 
      (payment.goodsSold + (0.5 * (payment.halfPriceGoodsSold || 0)))) + 
      (payment.bonusTwenty ? 20 : 0) + 
      (payment.bonusFifty ? 50 : 0);
  }
}

export function getPayouts(round: OperatingRound): {[Payee]: number}{
  // shares is {[ShareHolder]: number}
  let res = {};
  if ((round == null) || (round.shares == null))
    return res;
  const companies = Object.keys(round.shares);
  companies.forEach(companyName => {
    const shares = round.shares[companyName];
    const shareHolders = Object.keys(shares);
    const payment = round.payments[companyName];
    if(!payment)
      return;
    const ownedShareCount = shareHolders.reduce((sum, sh) => sum + shares[sh], 0);
    const companyOwnedShares = 10 - ownedShareCount;
    const payAmt = paymentTotal(payment);
    const perShareAmt = Math.round(payAmt / 10)
    res[companyName] = (res[companyName] || 0) + (perShareAmt * companyOwnedShares);
    console.log('payment');
    console.log(payment);
    shareHolders.forEach((sh) => {
      res[sh] = (res[sh] || 0) + (perShareAmt * shares[sh]);
    });
  });
  return res;
}
