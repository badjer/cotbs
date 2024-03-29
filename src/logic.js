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

export type Payment = {
  total: number,
  unitPrice: number,
  goodsSold: number,
  halfPriceGoodsSold: number,
  bonusTwenty: boolean,
  bonusFifty: boolean,
  extraAmt: number,
  withhold: boolean,
}

export type OperatingRound = {
  // Copied because it changes round to round
  // and the base price can change round to round
  companies: Company[];
  // companyName -> playerName -> numShares
  shares: {[CompanyName]: {[Shareholder]: number}},
  // companyName -> Payment
  payments: {[string]: Payment},
  stocks: {[CompanyName]: number},
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

function newRound(companies: Company[], shares: {[CompanyName]: {[Shareholder]: number}}, stocks: {[CompanyName]: number}): OperatingRound {
  return {
    companies: copy(companies),
    shares: copy(shares),
    payments: {},
    stocks: copy(stocks),
  };
}

export function newGame(players: Player[] = ['Red','Green','Yellow','Blue']): Game{
  return {
    players: players,
    currentRound: 1,
    rounds: [newRound([], {}, {})],
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
  const isNewRound = res.currentRound === res.rounds.length;

  if(isNewRound)
    res.rounds[res.currentRound] = newRound(curRound.companies, curRound.shares, curRound.stocks);
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
    let c = curRound.companies.filter(c => c.name === companyName)[0];
    c.basePrice = payment.unitPrice;
  }
  return res;
}

export function setStock(game: Game, companyName: string, price?: number): Game{
  let res = copy(game);
  let curRound = res.rounds[res.currentRound-1];
  curRound.stocks[companyName] = price || 0;
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
  return (payment.unitPrice * 
    ((payment.goodsSold || 0) + (0.5 * (payment.halfPriceGoodsSold || 0)))) + 
    (payment.bonusTwenty ? 20 : 0) + 
    (payment.bonusFifty ? 50 : 0) + 
    (payment.extraAmt || 0);
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
    const perShareAmt = Math.floor(payAmt / 10)
    if (payment.withhold){
      res[companyName] = (res[companyName] || 0) + payAmt;
    } else {
      res[companyName] = (res[companyName] || 0) + (perShareAmt * companyOwnedShares);
      shareHolders.forEach((sh) => {
        res[sh] = (res[sh] || 0) + (perShareAmt * shares[sh]);
      });
    }
  });
  return res;
}

export function getPortfolioValues(players: Player[], stocks: {[CompanyName]: number}, shares: {[CompanyName]: {[Shareholder]: number}}): {[Player]: number}{
  let res = {};
  players.forEach((player) => {
    res[player] = 0;
  });
  const companies = Object.keys(shares);
  companies.forEach((company) => {
    players.forEach((player) => {
      res[player] += ((shares[company][player] || 0) * (stocks[company] || 0));
    });
  });
  return res;
}
