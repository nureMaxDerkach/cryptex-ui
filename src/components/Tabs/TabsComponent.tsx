import {Box, Tabs, Tab, Container} from '@mui/material';
import React, {useState, useEffect, useCallback} from 'react';
import {SaleAndPurchaseCryptoComponent}
    from '../SaleAndPurchaseCrypto/SaleAndPurchaseCryptoComponent.tsx';
import {WalletComponent} from "../Wallet/WalletComponent.tsx";
import { fetchWalletDataAsync } from '../../api/walletApi.ts';
import { type IWalletResponse } from '../../types.ts';
import { WithdrawComponent } from '../Withdraw/WithdrawComponent.tsx';
import { fetchHistoryAsync } from '../../api/historyApi.ts';
import { type ITransaction } from '../../types.ts';
import { ExchangeComponent } from '../Exchange/ExchangeComponent.tsx';

export function TabsComponent() {
    const [activeTab, setActiveTab] = useState('trade');

    const [userData, setUserData] = useState<IWalletResponse | null>(null);
    const [historyData, setHistoryData] = useState<ITransaction[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        // ... (ваш код fetchAllData) ...
        setError(null);
        try {
            const [user, history] = await Promise.all([
                fetchWalletDataAsync(),
                fetchHistoryAsync()
            ]);
            setUserData(user);
            setHistoryData(history);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchAllData();
    }, [fetchAllData]);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const handleDataRefresh = () => {
        fetchAllData();
    };

    const tabs = [
        { id: 'trade', label: 'Trade' },
        { id: 'exchange', label: 'Exchange' },
        { id: 'wallet', label: 'Wallet' },
        { id: 'withdraw', label: 'Withdraw' },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleChange} /* ... */ >
                    {tabs.map((tab) => (
                        <Tab key={tab.id} label={tab.label} value={tab.id}/>
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
                {activeTab === 'trade' && (
                    <SaleAndPurchaseCryptoComponent onTradeSuccess={handleDataRefresh} />
                )}
                {activeTab === 'exchange' && (
                    <ExchangeComponent
                        userData={userData}
                        isLoading={isLoading}
                        error={error}
                        onExchangeSuccess={handleDataRefresh}
                    />
                )}
                {activeTab === 'wallet' && (
                    <WalletComponent
                        walletData={userData}
                        historyData={historyData}
                        isLoading={isLoading}
                        error={error}
                        onRefresh={handleDataRefresh}
                    />
                )}
                {activeTab === 'withdraw' && (
                    <WithdrawComponent
                        userData={userData}
                        isLoading={isLoading}
                        error={error}
                        onWithdrawSuccess={handleDataRefresh}
                    />
                )}
            </Box>
        </Container>
    );
}