import {PrintData} from '../model/PrintData';

export class PrintUseCase {
    private printData: PrintData;

    constructor(printData: PrintData) {
        this.printData = printData;
    }

    setPrintData(printData: PrintData): void {
        this.printData = printData;
    }

    execute(): void {
        this.printData.print();
    }
}