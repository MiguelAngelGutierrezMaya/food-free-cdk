import {SNSStackModel} from "../model/SNSStackModel";

export class LoadSNSUseCase {
    private snsModel: SNSStackModel;

    constructor(snsModel: SNSStackModel) {
        this.snsModel = snsModel;
    }

    async execute(): Promise<void> {
        this.snsModel.initialize();
    }
}