import {SQSStackModel} from "../model/SQSStackModel";

export class LoadSQSUseCase {
    private sqsModel: SQSStackModel;

    constructor(sqsModel: SQSStackModel) {
        this.sqsModel = sqsModel;
    }

    async execute(): Promise<void> {
        this.sqsModel.initialize();
    }
}