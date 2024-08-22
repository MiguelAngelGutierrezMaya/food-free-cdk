import {CfnOutput, CfnOutputProps, Stack} from 'aws-cdk-lib';
import {PrintData} from '../model/PrintData';

export class PrintOutput implements PrintData {
    private dataToPrint?: CfnOutputProps;
    private stack: Stack;
    private id: string;

    constructor(stack: Stack, id: string, dataToPrint?: CfnOutputProps) {
        this.dataToPrint = dataToPrint;
        this.stack = stack;
        this.id = id;
    }

    setDataToPrint(dataToPrint: CfnOutputProps): void {
        this.dataToPrint = dataToPrint;
    }

    print(): void {
        new CfnOutput(
            this.stack,
            this.id,
            this.dataToPrint || {
                value: 'No data to print',
            },
        );
    }
}
