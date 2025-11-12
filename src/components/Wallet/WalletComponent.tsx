import {useMemo, useState} from 'react'
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
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
} from '@mui/material'
import {useTheme} from '@mui/material/styles';
import { type IWalletResponse, type ITransaction } from '../../types';

const COIN_ID_MAP: { [key: number]: { name: string, symbol: string } } = {
    0: { name: 'Bitcoin', symbol: 'BTC' },
    1: { name: 'Ethereum', symbol: 'ETH' },
    2: { name: 'Litecoin', symbol: 'LTC' },
    3: { name: 'BNB', symbol: 'BNB' },
    4: { name: 'Solana', symbol: 'SOL' },
    5: { name: 'Ripple', symbol: 'XRP' },
};

interface WalletComponentProps {
    walletData: IWalletResponse | null; // Це ваш тип IUser
    historyData: ITransaction[];
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

export function WalletComponent({ walletData, historyData, isLoading, error, onRefresh }: WalletComponentProps) {
    const theme = useTheme();

    const [selectedAssetId, setSelectedAssetId] = useState<number | 'USD' | null>(null);


    const formatCurrency = (value: number, decimals: number = 2) => {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })
    }

    const formatTimestamp = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    }


    const processedData = useMemo(() => {
        if (!walletData || !walletData.wallet) {
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

        // Рахуємо загальну вартість
        const cryptoTotalValue = balances.reduce((total, coin) => total + coin.usdValue, 0);
        const fiatBalance = walletData.balance; // Фіатний баланс
        const totalValue = cryptoTotalValue + fiatBalance;

        return { balances, totalValue, fiatBalance };

    }, [walletData]); // Залежність від даних користувача

    // Фільтруємо історію на основі обраного активу
   const filteredHistory = useMemo(() => {

        // 1. Ця перевірка ПРАВИЛЬНА (вона коректно обробляє null та 0)
        if (selectedAssetId === null) {
            return []; // Нічого не обрано
        }

        if (selectedAssetId === 'USD') {
            // Фільтр для USD (де coinName - null)
            return historyData.filter(tx => tx.coinName === null);
        }

        const filtered = historyData.filter(tx => {
            if (tx.coinName === selectedAssetId) {
                return true;
            }
            return false;
        });

        return filtered;

    }, [selectedAssetId, historyData])


    const getTransactionTypeProps = (tx: ITransaction) => {
        switch (tx.type) {
            case 1: return { text: 'Withdraw', color: 'error' as const };
            case 2: return { text: 'Buy', color: 'success' as const };
            case 3: return { text: 'Sell', color: 'error' as const };
            default: return { text: 'Unknown', color: 'default' as const };
        }
    };

    const formatCoinAmount = (tx: ITransaction) => {
        if (tx.coinName === null) return 'N/A'; // Для USD
        const symbol = COIN_ID_MAP[tx.coinName]?.symbol || '???';
        return `${tx.coinAmount.toFixed(6)} ${symbol}`;
    }

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

                    {/* Картка для фіатного балансу (USD) */}
                    <Grid item xs={12} sm={6} md={4}>
                         <Paper
                            elevation={selectedAssetId === 'USD' ? 4 : 1}
                            sx={{
                                p: 2,
                                cursor: 'pointer',
                                borderColor: selectedAssetId === 'USD' ? 'primary.main' : 'transparent',
                                border: 2,
                                '&:hover': {
                                    borderColor: selectedAssetId === 'USD' ? 'primary.main' : 'grey.300',
                                }
                            }}
                            onClick={() => setSelectedAssetId('USD')}
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
                                elevation={selectedAssetId === coin.id ? 4 : 1}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderColor: selectedAssetId === coin.id ? 'primary.main' : 'transparent',
                                    border: 2,
                                    '&:hover': {
                                        borderColor: selectedAssetId === coin.id ? 'primary.main' : 'grey.300',
                                    }
                                }}
                                onClick={() => setSelectedAssetId(coin.id)}
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

                {/* --- СЕКЦІЯ ІСТОРІЇ ТРАНЗАКЦІЙ --- */}
                {selectedAssetId !== null && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                            Transaction History for {selectedAssetId === 'USD' ? 'USD' : COIN_ID_MAP[selectedAssetId as number]?.symbol}
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Amount (Coin)</TableCell>
                                        <TableCell>Change (USD)</TableCell>
                                        <TableCell>Price Per Coin</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredHistory.length > 0 ? (
                                        filteredHistory.map((tx) => {
                                            const typeProps = getTransactionTypeProps(tx);
                                            return (
                                                <TableRow key={tx.id}>
                                                    <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={typeProps.text}
                                                            color={typeProps.color}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{formatCoinAmount(tx)}</TableCell>
                                                    <TableCell sx={{ color: tx.usdValueChange >= 0 ? 'success.main' : 'error.main' }}>
                                                        {tx.usdValueChange >= 0 ? '+' : ''}${formatCurrency(tx.usdValueChange, 2)}
                                                    </TableCell>
                                                    <TableCell>${formatCurrency(tx.pricePerCoin, 2)}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No transactions found for this asset.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}