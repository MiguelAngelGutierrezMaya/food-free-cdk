import {ApiStackModel} from '../model/ApiStackModel';

export class LoadApiUseCase {
    private apiStackModel: ApiStackModel;

    constructor(apiStackModel: ApiStackModel) {
        this.apiStackModel = apiStackModel;
    }

    async execute(): Promise<void> {
        this.apiStackModel.initialize();
    }
}
