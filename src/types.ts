export interface ISignUp {
    googleID: string | null;
    email: string;
    name: string;
    surname: string | null;
    phoneNumber: string | null;
    age: number;
    country: string | null;
    adress: string | null;
    password: string;
    role: string | null;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginAndSignUpForm {
    name: string;
    surname: string;
    email: string;
    password: string;
    phoneNumber: string;
    age: string | number;
    country: string;
    adress: string;
}


export interface ISeedPhrase {
    seedPhraseValues: string[];
    id: number;
}

export interface IAmountOfCoin {
    name: number;
    price: number;
    amount: number;
    walletId: number;
    id: number;
}

export interface IWallet {
    seedPhrase: ISeedPhrase;
    seedPhraseId: number;
    amountOfCoins: IAmountOfCoin[];
    walletType: number;
    id: number;
}

export interface IUser {
    wallet: IWallet;
    walletId: number;
    name: string;
    googleID: string | null;
    surname: string;
    phoneNumber: string;
    adress: string;
    age: number;
    email: string;
    country: string;
    gender: number;
    role: number;
    followersIds: number[] | null;
    income: number | null;
    balance: number;
    balanceForCopyTrading: number | null;
    isBanned: boolean;
    passwordHash: string;
    passwordSalt: string;
    isSilent: boolean;
    id: number;
}

export interface IWalletResponse extends IUser {}

