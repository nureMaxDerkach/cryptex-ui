import {useState} from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
} from '@mui/material'
import {useTheme} from '@mui/material/styles';
import {CRYPTO_BALANCES, CRYPTO_TRANSACTIONS} from '../../data/constants';

export function WalletComponent() {
    type CoinKey = keyof typeof CRYPTO_BALANCES;

    const theme = useTheme();

    const [selectedCoin, setSelectedCoin] = useState<CoinKey | null>(null)

    const formatCurrency = (value: number, decimals: number = 6) => {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })
    }

    const totalPortfolioValue = Object.values(CRYPTO_BALANCES).reduce(
        (total, coin) => total + coin.usdValue,
        0,
    )

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success'
            case 'pending':
                return 'warning'
            default:
                return 'error'
        }
    }

    const getTypeChipColor = (type: string) => {
        switch (type) {
            case 'buy':
                return 'success'
            case 'sell':
                return 'error'
            default:
                return 'info'
        }
    }

    const getTransactionType = (type: string): string => {
        return type === 'sell' ? '-' : "+";
    }

    const uppercaseFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 'medium',
                                color: 'text.primary',
                            }}
                        >
                            ${formatCurrency(totalPortfolioValue, 2)}
                        </Box>
                    </Typography>
                </Box>
                <Grid
                    container
                    spacing={3}
                    sx={{
                        mb: 4,
                    }}
                >
                    {/*Coin info*/}
                    {Object.entries(CRYPTO_BALANCES).map(([coinId, coin]) => (
                        <Grid key={coinId}>
                            <Paper
                                elevation={selectedCoin === coinId ? 3 : 1}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    border: 2,
                                    borderColor:
                                        selectedCoin === coinId
                                        ? 'primary.main' : 'transparent',
                                    bgcolor:
                                        selectedCoin === coinId
                                        ? 'primary.50'
                                        : 'background.paper',
                                    '&:hover': {
                                        borderColor:
                                            selectedCoin === coinId
                                            ? 'primary.main' : 'grey.300',
                                    },
                                }}
                                onClick={() => setSelectedCoin(coinId as CoinKey)}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor:
                                                theme.palette.mode === 'dark'
                                                ? theme.palette.grey[800]
                                                : theme.palette.grey[100],
                                            color:
                                                theme.palette.mode === 'dark'
                                                ? theme.palette.grey[100]
                                                : theme.palette.text.primary,
                                            fontSize: '0.75rem',
                                            fontWeight: 'medium',
                                            mr: 1,
                                        }}
                                    >
                                        {coin.symbol}
                                    </Avatar>
                                    <Typography variant="body1"
                                                fontWeight="medium">
                                        {coin.name}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" component="div"
                                            fontWeight="semibold">
                                    {formatCurrency(coin.balance)} {coin.symbol}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    ${formatCurrency(coin.usdValue, 2)} USD
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                {selectedCoin && (
                    <Box
                        sx={{
                            mt: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" component="h3">
                                {CRYPTO_BALANCES[selectedCoin].name} Transaction
                                History
                            </Typography>
                            <Button
                                variant="text"
                                color="primary"
                                size="small"
                                onClick={() => setSelectedCoin(null)}
                            >
                                Back to All Coins
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Value (USD)</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {CRYPTO_TRANSACTIONS[selectedCoin]?.map((tx, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{tx.date}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        uppercaseFirstLetter(tx.type)
                                                    }
                                                    size="small"
                                                    color={getTypeChipColor(tx.type)}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {getTransactionType(tx.type)}
                                                {formatCurrency(tx.amount)}{' '}
                                                {CRYPTO_BALANCES[selectedCoin].symbol}
                                            </TableCell>
                                            <TableCell>${formatCurrency(tx.usdValue, 2)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        uppercaseFirstLetter(tx.status)
                                                    }
                                                    size="small"
                                                    color={getStatusChipColor(tx.status)}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}