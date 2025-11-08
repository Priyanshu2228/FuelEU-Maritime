import { EventEmitter } from 'events';

class EventBusAdapter {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public publish(eventName: string, data: any): void {
        this.eventEmitter.emit(eventName, data);
    }

    public subscribe(eventName: string, listener: (data: any) => void): void {
        this.eventEmitter.on(eventName, listener);
    }

    public unsubscribe(eventName: string, listener: (data: any) => void): void {
        this.eventEmitter.off(eventName, listener);
    }
}

export default new EventBusAdapter();
