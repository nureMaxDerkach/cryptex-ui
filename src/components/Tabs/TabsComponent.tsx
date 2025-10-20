import {Box, Tabs, Tab, Container} from '@mui/material';
import React, {useState} from 'react';
import {SaleAndPurchaseCryptoComponent}
    from '../SaleAndPurchaseCrypto/SaleAndPurchaseCryptoComponent.tsx';
import {WalletComponent} from "../Wallet/WalletComponent.tsx";

export function TabsComponent() {
    const [activeTab, setActiveTab] = useState('trade');
    const tabs = [
        {
            id: 'trade',
            label: 'Trade',
        },
        {
            id: 'wallet',
            label: 'Wallet',
        },
    ]

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue)
    }

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
                    {tabs.map((tab) => (
                        <Tab key={tab.id} label={tab.label} value={tab.id}/>
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
                {activeTab === 'trade' && <SaleAndPurchaseCryptoComponent/>}
                {activeTab === 'wallet' && <WalletComponent/>}
            </Box>
        </Container>
    );
}