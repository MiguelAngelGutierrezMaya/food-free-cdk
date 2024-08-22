import {LambdaStackModel} from '../model/LambdaStackModel';

export class LoadLambdasUseCase {
    private lambdaStackModel: LambdaStackModel;

    constructor(lambdaStackModel: LambdaStackModel) {
        this.lambdaStackModel = lambdaStackModel;
    }

    async execute(): Promise<void> {
        this.lambdaStackModel.initialize();
        this.lambdaStackModel.addRolePolicies();
        this.lambdaStackModel.makeIntegration();
        this.lambdaStackModel.makeSubscriptions();
    }
}