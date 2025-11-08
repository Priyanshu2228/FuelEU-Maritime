export class LocalStorageAdapter {
    private static readonly STORAGE_KEY = 'fuelRecords';

    public static save(records: any[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }

    public static load(): any[] {
        const records = localStorage.getItem(this.STORAGE_KEY);
        return records ? JSON.parse(records) : [];
    }

    public static clear(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
