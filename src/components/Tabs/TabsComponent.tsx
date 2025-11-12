import {Box, Tabs, Tab, Container} from '@mui/material';
import React, {useState, useEffect, useCallback} from 'react';
import {SaleAndPurchaseCryptoComponent}
    from '../SaleAndPurchaseCrypto/SaleAndPurchaseCryptoComponent.tsx';
import {WalletComponent} from "../Wallet/WalletComponent.tsx";
// Нові імпорти
import { fetchWalletDataAsync } from '../../api/walletApi.ts';
import { type IWalletResponse } from '../../types.ts';

export function TabsComponent() {
    const [activeTab, setActiveTab] = useState('trade');

    // Стан для даних гаманця
    const [walletData, setWalletData] = useState<IWalletResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Функція для завантаження/оновлення даних
    const fetchWallet = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchWalletDataAsync();
            setWalletData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Завантажуємо дані при першому рендері
    useEffect(() => {
        if (activeTab === 'wallet' && !walletData) {
            fetchWallet();
        }
    }, [activeTab, walletData, fetchWallet]);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const handleTradeSuccess = () => {
        fetchWallet();
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    aria-label="currency workspace tabs"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab key="trade" label="Trade" value="trade"/>
                    <Tab key="wallet" label="Wallet" value="wallet"/>
                </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
                {activeTab === 'trade' && (
                    <SaleAndPurchaseCryptoComponent onTradeSuccess={handleTradeSuccess} />
                )}
                {activeTab === 'wallet' && (
                    <WalletComponent
                        walletData={walletData}
                        isLoading={isLoading}
                        error={error}
                        onRefresh={fetchWallet}
                    />
                )}
            </Box>
        </Container>
    );
}