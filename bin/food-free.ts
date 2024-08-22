#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {environments} from "./../config.json"
import {SNSStack} from "../lib/infrastructure/SNSStack";
import {LoadSNSUseCase} from "../lib/application/LoadSNSUseCase";
import {Topic} from "aws-cdk-lib/aws-sns";
import {PrintOutput} from "../lib/infrastructure/PrintOutput";
import {PrintUseCase} from "../lib/application/PrintUseCase";
import {SQSStack} from "../lib/infrastructure/SQSStack";
import {LoadSQSUseCase} from "../lib/application/LoadSQSUseCase";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {LambdaStack} from "../lib/infrastructure/LambdaStack";
import {LoadLambdasUseCase} from "../lib/application/LoadLambdaUseCase";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {LambdaIntegration, Resource} from "aws-cdk-lib/aws-apigateway";
import {ApiStack} from "../lib/infrastructure/ApiStack";
import {LoadApiUseCase} from "../lib/application/LoadApiUseCase";

const app = new cdk.App();

// new FoodFreeEmptyStack(app, 'FoodFreeEmptyStack', {
//     /* If you don't specify 'env', this stack will be environment-agnostic.
//      * Account/Region-dependent features and context lookups will not work,
//      * but a single synthesized template can be deployed anywhere. */
//
//     /* Uncomment the next line to specialize this stack for the AWS Account
//      * and Region that are implied by the current CLI configuration. */
//     // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
//
//     /* Uncomment the next line if you know exactly what Account and Region you
//      * want to deploy the stack to. */
//     // env: { account: '123456789012', region: 'us-east-1' },
//
//     /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });

const env_name: string = process.env.ENV_NAME || 'dev';
const envs: { [key: string]: any } = {
    prod: (environments.prod || {}) as { [key: string]: any },
    dev: (environments.dev || {}) as { [key: string]: any },
};
const props: { [key: string]: any } = {
    environment: envs[env_name] || {},
};

//
// UseCase 1: Initialize SNSStack and print the topic name and ARN
//
const foodFreeSNSStack: SNSStack = new SNSStack(
    app,
    `FoodFree${env_name}SNSStack`,
    {
        environment: props.environment
    },
);
const loadSNS: LoadSNSUseCase = new LoadSNSUseCase(foodFreeSNSStack);
loadSNS.execute().then();

const foodFreeIngredientsTopic: Topic = foodFreeSNSStack.getIngredientsTopic();

const loadSNSOutput: PrintOutput = new PrintOutput(
    foodFreeSNSStack,
    `FoodFree${env_name}SNSStackOutput`,
    {
        value: `${foodFreeIngredientsTopic.topicName} - ${foodFreeIngredientsTopic.topicArn}`,
    },
);

const printSNSUseCase: PrintUseCase = new PrintUseCase(loadSNSOutput);
printSNSUseCase.execute();

//
// UseCase 2: Initialize SQSStack and print the queue name and ARN
//
const foodFreeSQSStack: SQSStack = new SQSStack(
    app,
    `FoodFree${env_name}SQSStack`,
    {
        environment: props.environment
    },
);
const loadSQS: LoadSQSUseCase = new LoadSQSUseCase(foodFreeSQSStack);
loadSQS.execute().then();

const foodFreeOrdersQueue: Queue = foodFreeSQSStack.getOrdersQueue();
const foodFreeIngredientsQueue: Queue = foodFreeSQSStack.getIngredientsQueue();

const loadSQSOutput: PrintOutput = new PrintOutput(
    foodFreeSQSStack,
    `FoodFree${env_name}SQSStackOutput`,
    {
        value: `${foodFreeOrdersQueue.queueName} - ${foodFreeOrdersQueue.queueArn} - ${foodFreeIngredientsQueue.queueName} - ${foodFreeIngredientsQueue.queueArn}`,
    },
);

const printSQSUseCase: PrintUseCase = new PrintUseCase(loadSQSOutput);
printSQSUseCase.execute();

//
// UseCase 3: Initialize LambdaStack and print the node function lambda name and ARN
//
const foodFreeLambdaStack: LambdaStack = new LambdaStack(
    app,
    `FoodFree${env_name}LambdaStack`,
    {
        foodFreeIngredientsTopic,
        foodFreeOrdersQueue,
        foodFreeIngredientsQueue,
        environment: props.environment
    },
);
const loadLambdas: LoadLambdasUseCase = new LoadLambdasUseCase(
    foodFreeLambdaStack,
);
loadLambdas.execute().then();

const ordersNodeFunction: NodejsFunction = foodFreeLambdaStack.getOrdersNodeFunction();
const kitchenNodeFunction: NodejsFunction = foodFreeLambdaStack.getKitchenNodeFunction();
const storeNodeFunction: NodejsFunction = foodFreeLambdaStack.getStoreNodeFunction();
const kitchenSubscriptionSNSNodeFunction: NodejsFunction = foodFreeLambdaStack.getKitchenSubscriptionSNSNodeFunction();
const kitchenSubscriptionOrdersSQSNodeFunction: NodejsFunction = foodFreeLambdaStack.getKitchenSubscriptionOrdersSQSNodeFunction();
const storeSubscriptionIngredientsSQSNodeFunction: NodejsFunction = foodFreeLambdaStack.getStoreSubscriptionIngredientsSQSNodeFunction();

const loadLambdaOutput: PrintOutput = new PrintOutput(
    foodFreeLambdaStack,
    `FoodFree${env_name}LambdaStackOutput`,
    {
        value: `${ordersNodeFunction.functionName} - ${ordersNodeFunction.functionArn} - ${kitchenNodeFunction.functionName} - ${kitchenNodeFunction.functionArn} - ${storeNodeFunction.functionName} - ${storeNodeFunction.functionArn} - ${kitchenSubscriptionSNSNodeFunction.functionName} - ${kitchenSubscriptionSNSNodeFunction.functionArn} - ${kitchenSubscriptionOrdersSQSNodeFunction.functionName} - ${kitchenSubscriptionOrdersSQSNodeFunction.functionArn} - ${storeSubscriptionIngredientsSQSNodeFunction.functionName} - ${storeSubscriptionIngredientsSQSNodeFunction.functionArn}`,
    }
)

const printLambdaUseCase: PrintUseCase = new PrintUseCase(loadLambdaOutput);
printLambdaUseCase.execute();

//
// UseCase 4: Initialize ApiStack and print the api name and id
//
const ordersLambdaIntegration: LambdaIntegration = foodFreeLambdaStack.getOrdersLambdaIntegration();
const kitchenLambdaIntegration: LambdaIntegration = foodFreeLambdaStack.getKitchenLambdaIntegration();
const storeLambdaIntegration: LambdaIntegration = foodFreeLambdaStack.getStoreLambdaIntegration();

const foodFreeApiStack: ApiStack = new ApiStack(app, `FoodFree${env_name}ApiStack`, {
    ordersLambdaIntegration,
    kitchenLambdaIntegration,
    storeLambdaIntegration,
    environment: props.environment
});
const loadApi: LoadApiUseCase = new LoadApiUseCase(foodFreeApiStack);
loadApi.execute().then();

const ordersResource: Resource = foodFreeApiStack.getOrdersResource();
const kitchenResource: Resource = foodFreeApiStack.getKitchenResource();
const storeResource: Resource = foodFreeApiStack.getStoreResource();

const loadApiOutput: PrintOutput = new PrintOutput(
    foodFreeApiStack,
    `FoodFree${env_name}ApiStackOutput`,
    {
        value: `${ordersResource.api.restApiName} - ${kitchenResource.api.restApiId} - ${storeResource.api.restApiName}`,
    },
);

const printApiUseCase: PrintUseCase = new PrintUseCase(loadApiOutput);
printApiUseCase.execute();
