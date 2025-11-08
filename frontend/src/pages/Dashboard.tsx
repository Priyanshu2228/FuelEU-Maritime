import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { FuelRecord } from '../domain/models/FuelRecord';
import fuelClient from '../services/fuelClient';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';

// Modal component for adding records
const AddRecordModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (record: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = React.useState({
        fuelType: 'HFO',
        amount: '',
        vesselName: '',
        routeId: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                width: '400px',
                maxWidth: '90%'
            }}>
                <h2 style={{ marginBottom: '16px', color: '#10b981' }}>Add New Record</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Fuel Type</label>
                        <select
                            value={formData.fuelType}
                            onChange={e => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="HFO">HFO</option>
                            <option value="LNG">LNG</option>
                            <option value="MGO">MGO</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Amount (metric tons)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px'
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Vessel Name</label>
                        <input
                            type="text"
                            value={formData.vesselName}
                            onChange={e => setFormData(prev => ({ ...prev, vesselName: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px'
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Route ID</label>
                        <input
                            type="text"
                            value={formData.routeId}
                            onChange={e => setFormData(prev => ({ ...prev, routeId: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px'
                            }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px',
                                backgroundColor: 'white'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [fuelRecords, setFuelRecords] = React.useState<FuelRecord[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchFuelRecords = async () => {
            setLoading(true);
            setError(null);
            try {
                const records = await fuelClient.getAllFuelRecords();
                setFuelRecords(records as FuelRecord[]);
            } catch (e: any) {
                setError(e?.message || 'Failed to load records');
            } finally {
                setLoading(false);
            }
        };

        fetchFuelRecords();
    }, [user?.id]);

    const handleAddRecord = async (record: any) => {
        setLoading(true);
        setError(null);
        try {
            await fuelClient.createFuelRecord(record);
            const records = await fuelClient.getAllFuelRecords();
            setFuelRecords(records as FuelRecord[]);
            setIsModalOpen(false);
        } catch (e: any) {
            setError(e?.message || 'Failed to add record');
        } finally {
            setLoading(false);
        }
    };



    return (
        <Container>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '8px' }}>Maritime Emissions Dashboard</h1>
                <p style={{ color: '#6b7280' }}>View and analyze maritime vessel emissions data</p>
            </div>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '24px' }}>
                <Card title="Total Records">
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                        {fuelRecords.length}
                    </div>
                    <div style={{ color: '#6b7280' }}>Fuel records analyzed</div>
                </Card>

                <Card title="Total Emissions">
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                        {fuelRecords.reduce((acc, record) => acc + ((record as any).emission?.value ?? (record as any).emissions ?? 0), 0).toFixed(2)}
                    </div>
                    <div style={{ color: '#6b7280' }}>Total gCO₂e emissions</div>
                </Card>

                <Card title="Unique Vessels">
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                        {new Set(fuelRecords.map(r => r.vesselName)).size}
                    </div>
                    <div style={{ color: '#6b7280' }}>Vessels monitored</div>
                </Card>
            </div>

            <Card title="Fuel Records">
                <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Add Record
                    </button>
                </div>

                <AddRecordModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddRecord}
                />
                
                {loading && <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Loading fuel records...</div>}
                
                {error && (
                    <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#fee2e2', 
                        color: '#dc2626', 
                        borderRadius: '4px',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Vessel</th>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Fuel Type</th>
                                    <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Quantity</th>
                                    <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Emissions (gCO₂e)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fuelRecords.map(record => (
                                    <tr key={record.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '12px 16px' }}>{new Date(record.date).toLocaleString()}</td>
                                        <td style={{ padding: '12px 16px' }}>{record.vesselName || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>{(record as any).fuelType || '—'}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>{(record as any).quantity ?? (record as any).amount}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>{((record as any).emission?.value ?? (record as any).emissions ?? 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default Dashboard;