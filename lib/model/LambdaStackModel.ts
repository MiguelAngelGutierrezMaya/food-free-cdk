import {StackModel} from './StackModel';

export interface LambdaStackModel extends StackModel {
    addRolePolicies(): void;

    makeIntegration(): void;

    makeSubscriptions(): void;
}
