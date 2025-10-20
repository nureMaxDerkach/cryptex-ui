export const CURRENCIES = {
    USD: {
        name: 'US Dollar',
        symbol: '$',
    },
    EUR: {
        name: 'Euro',
        symbol: '€',
    },
    GBP: {
        name: 'British Pound',
        symbol: '£',
    },
    JPY: {
        name: 'Japanese Yen',
        symbol: '¥',
    },
    AUD: {
        name: 'Australian Dollar',
        symbol: 'A$',
    },
    CAD: {
        name: 'Canadian Dollar',
        symbol: 'C$',
    },
    CHF: {
        name: 'Swiss Franc',
        symbol: 'Fr',
    },
    CNY: {
        name: 'Chinese Yuan',
        symbol: '¥',
    },
}

export const MOCK_RATES = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.23,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92,
    CNY: 6.45,
}

// Cryptocurrency trading pairs
export const CRYPTO_PAIRS = [
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'ADA/USDT',
    'DOT/USDT',
    'BNB/USDT',
    'XRP/USDT',
    'DOGE/USDT',
]

// Cryptocurrency wallet balances
export const CRYPTO_BALANCES = {
    BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        balance: 0.28547,
        usdValue: 12045.87,
    },
    ETH: {
        name: 'Ethereum',
        symbol: 'ETH',
        balance: 3.75912,
        usdValue: 8654.32,
    },
    SOL: {
        name: 'Solana',
        symbol: 'SOL',
        balance: 48.32145,
        usdValue: 3845.76,
    },
    ADA: {
        name: 'Cardano',
        symbol: 'ADA',
        balance: 2450.75,
        usdValue: 1745.23,
    },
    DOT: {
        name: 'Polkadot',
        symbol: 'DOT',
        balance: 125.4328,
        usdValue: 1534.28,
    },
}

// Transaction history for each cryptocurrency
export const CRYPTO_TRANSACTIONS = {
    BTC: [
        {
            date: '2023-08-15',
            type: 'buy',
            amount: 0.15,
            usdValue: 6423.45,
            status: 'completed',
        },
        {
            date: '2023-07-22',
            type: 'buy',
            amount: 0.1,
            usdValue: 4120.32,
            status: 'completed',
        },
        {
            date: '2023-06-18',
            type: 'sell',
            amount: 0.05,
            usdValue: 1980.75,
            status: 'completed',
        },
        {
            date: '2023-05-04',
            type: 'transfer',
            amount: 0.08,
            usdValue: 3245.12,
            status: 'completed',
        },
    ],
    ETH: [
        {
            date: '2023-08-10',
            type: 'buy',
            amount: 2.0,
            usdValue: 4520.87,
            status: 'completed',
        },
        {
            date: '2023-07-15',
            type: 'buy',
            amount: 1.5,
            usdValue: 3245.65,
            status: 'completed',
        },
        {
            date: '2023-06-30',
            type: 'transfer',
            amount: 0.5,
            usdValue: 1120.45,
            status: 'completed',
        },
        {
            date: '2023-06-02',
            type: 'sell',
            amount: 0.25,
            usdValue: 545.32,
            status: 'completed',
        },
    ],
    SOL: [
        {
            date: '2023-08-12',
            type: 'buy',
            amount: 25.0,
            usdValue: 1987.45,
            status: 'completed',
        },
        {
            date: '2023-07-28',
            type: 'buy',
            amount: 15.0,
            usdValue: 1245.32,
            status: 'completed',
        },
        {
            date: '2023-07-15',
            type: 'buy',
            amount: 10.0,
            usdValue: 845.76,
            status: 'pending',
        },
    ],
    ADA: [
        {
            date: '2023-08-05',
            type: 'buy',
            amount: 1500.0,
            usdValue: 1050.45,
            status: 'completed',
        },
        {
            date: '2023-07-22',
            type: 'buy',
            amount: 950.0,
            usdValue: 675.32,
            status: 'completed',
        },
    ],
    DOT: [
        {
            date: '2023-08-01',
            type: 'buy',
            amount: 75.0,
            usdValue: 912.45,
            status: 'completed',
        },
        {
            date: '2023-07-15',
            type: 'buy',
            amount: 50.0,
            usdValue: 621.83,
            status: 'completed',
        },
    ],
}