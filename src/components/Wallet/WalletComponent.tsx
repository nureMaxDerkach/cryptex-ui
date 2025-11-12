import {useMemo} from 'react' // 'useMemo' додано
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    Button,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material'
import {useTheme} from '@mui/material/styles';
import { type IWalletResponse } from '../../types';

const COIN_ID_MAP: { [key: number]: { name: string, symbol: string } } = {
    0: { name: 'Bitcoin', symbol: 'BTC' },
    1: { name: 'Ethereum', symbol: 'ETH' },
    2: { name: 'Litecoin', symbol: 'LTC' },
    3: { name: 'BNB', symbol: 'BNB' },
    4: { name: 'Solana', symbol: 'SOL' },
    5: { name: 'Ripple', symbol: 'XRP' },
};

interface WalletComponentProps {
    walletData: IWalletResponse | null;
    isLoading: boolean;
    error: string | null;
    onRefresh: () => void;
}

interface ProcessedBalance {
    id: number;
    name: string;
    symbol: string;
    balance: number;
    usdValue: number;
}

export function WalletComponent({ walletData, isLoading, error, onRefresh }: WalletComponentProps) {
    const theme = useTheme();

    const formatCurrency = (value: number, decimals: number = 2) => { // Змінено 6 на 2
        return value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })
    }


    const processedData = useMemo(() => {
        if (!walletData || !walletData.wallet) {
            console.log('walletData: ', walletData);
            return { balances: [], totalValue: 0, fiatBalance: 0 };
        }



        const balances: ProcessedBalance[] = walletData.wallet.amountOfCoins.map(coin => {
            const coinInfo = COIN_ID_MAP[coin.name] || { name: `Unknown ${coin.name}`, symbol: '???' };
            const usdValue = coin.amount * coin.price;

            return {
                id: coin.name,
                name: coinInfo.name,
                symbol: coinInfo.symbol,
                balance: coin.amount,
                usdValue: usdValue,
            };
        });

        // Розраховуємо загальну вартість крипто-активів
        const cryptoTotalValue = balances.reduce((total, coin) => total + coin.usdValue, 0);

        // Додаємо фіатний баланс
        const fiatBalance = walletData.balance;
        const totalValue = cryptoTotalValue + fiatBalance;

        return { balances, totalValue, fiatBalance };

    }, [walletData]);


    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return (
            <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={onRefresh}>
                    Try Again
                </Button>
            }>
                {error}
            </Alert>
        );
    }

    if (!walletData) {
        return <Typography>No wallet data found.</Typography>;
    }

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" component="h2">
                        My Wallet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total Value:{' '}
                        <Box component="span" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            ${formatCurrency(processedData.totalValue, 2)}
                        </Box>
                    </Typography>
                </Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>

                    {/* Картка для фіатного балансу (USDT) */}
                    <Grid item xs={12} sm={6} md={4}>
                         <Paper
                            elevation={1}
                            sx={{ p: 2, bgcolor: 'background.paper' }}
                         >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar
                                    sx={{
                                        width: 32, height: 32,
                                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                        color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary,
                                        fontSize: '0.75rem', fontWeight: 'medium', mr: 1,
                                    }}
                                >
                                    USD
                                </Avatar>
                                <Typography variant="body1" fontWeight="medium">
                                    USD Balance
                                </Typography>
                            </Box>
                            <Typography variant="h6" component="div" fontWeight="semibold">
                                ${formatCurrency(processedData.fiatBalance)}
                            </Typography>
                         </Paper>
                    </Grid>

                    {/* Картки для крипто-балансів */}
                    {processedData.balances.map((coin) => (
                        <Grid item key={coin.id} xs={12} sm={6} md={4}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar
                                        sx={{
                                            width: 32, height: 32,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                            color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary,
                                            fontSize: '0.75rem', fontWeight: 'medium', mr: 1,
                                        }}
                                    >
                                        {coin.symbol}
                                    </Avatar>
                                    <Typography variant="body1" fontWeight="medium">
                                        {coin.name}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" component="div" fontWeight="semibold">
                                    {formatCurrency(coin.balance, 6)} {coin.symbol}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    ${formatCurrency(coin.usdValue, 2)} USD
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* ІСТОРІЯ ТРАНЗАКЦІЙ ПРИБРАНА.
                */}
            </CardContent>
        </Card>
    )
}