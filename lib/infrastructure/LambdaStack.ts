import {Duration, Stack, StackProps} from "aws-cdk-lib";
import {LambdaStackModel} from "../model/LambdaStackModel";
import {LambdaIntegration} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Construct} from "constructs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from "path";
// import {environments} from "./../../config.json";
import {Topic} from "aws-cdk-lib/aws-sns";
import {LambdaSubscription} from "aws-cdk-lib/aws-sns-subscriptions";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";

interface LambdaStackProps extends StackProps {
    foodFreeIngredientsTopic: Topic
    foodFreeOrdersQueue: Queue
    foodFreeIngredientsQueue: Queue
    environment: { [key: string]: any }
}

export class LambdaStack extends Stack implements LambdaStackModel {
    //
    // Properties
    //
    private props: LambdaStackProps;
    private readonly env_name: string;

    //
    // Lambda integrations
    //
    private ordersLambdaIntegration: LambdaIntegration;
    private kitchenLambdaIntegration: LambdaIntegration;
    private storeLambdaIntegration: LambdaIntegration;

    //
    // Lambda functions
    //
    private ordersNodeFunction: NodejsFunction;
    private kitchenNodeFunction: NodejsFunction;
    private kitchenSubscriptionSNSNodeFunction: NodejsFunction;
    private kitchenSubscriptionOrdersSQSNodeFunction: NodejsFunction;
    private storeNodeFunction: NodejsFunction;
    private storeSubscriptionIngredientsSQSNodeFunction: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);
        this.props = props;

        this.env_name = this.props.environment.name || '';
    }

    getOrdersLambdaIntegration(): LambdaIntegration {
        return this.ordersLambdaIntegration;
    }

    getKitchenLambdaIntegration(): LambdaIntegration {
        return this.kitchenLambdaIntegration;
    }

    getStoreLambdaIntegration(): LambdaIntegration {
        return this.storeLambdaIntegration;
    }

    getOrdersNodeFunction(): NodejsFunction {
        return this.ordersNodeFunction;
    }

    getKitchenNodeFunction(): NodejsFunction {
        return this.kitchenNodeFunction;
    }

    getKitchenSubscriptionSNSNodeFunction(): NodejsFunction {
        return this.kitchenSubscriptionSNSNodeFunction;
    }

    getKitchenSubscriptionOrdersSQSNodeFunction(): NodejsFunction {
        return this.kitchenSubscriptionOrdersSQSNodeFunction;
    }

    getStoreNodeFunction(): NodejsFunction {
        return this.storeNodeFunction;
    }

    getStoreSubscriptionIngredientsSQSNodeFunction(): NodejsFunction {
        return this.storeSubscriptionIngredientsSQSNodeFunction;
    }

    initialize(): void {
        const region = this.props.environment.region || 'us-east-1';

        this.ordersNodeFunction = new NodejsFunction(this, `OrdersFoodFree${this.env_name}Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            timeout: Duration.seconds(90),
            entry: join(
                __dirname,
                '..',
                '..',
                'src',
                'modules',
                'orders',
                'infrastructure',
                'handler.ts',
            ),
            environment: {
                REGION: region,
                ORDERS_QUEUE_URL: this.props.foodFreeOrdersQueue.queueUrl,
            },
        });

        this.kitchenNodeFunction = new NodejsFunction(this, `KitchenFoodFree${this.env_name}Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            timeout: Duration.seconds(90),
            entry: join(
                __dirname,
                '..',
                '..',
                'src',
                'modules',
                'kitchen',
                'infrastructure',
                'handler.ts',
            ),
            environment: {
                REGION: region,
                INGREDIENTS_QUEUE_URL: this.props.foodFreeIngredientsQueue.queueUrl,
            },
        });

        this.kitchenSubscriptionSNSNodeFunction = new NodejsFunction(this, `KitchenSubscriptionSNSFoodFree${this.env_name}Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(60),
            handler: 'handler_ingredients_sns_suscription',
            entry: join(
                __dirname,
                '..',
                '..',
                'src',
                'modules',
                'kitchen',
                'infrastructure',
                'subscriptions.ts',
            ),
            environment: {
                REGION: region
            },
        });

        this.kitchenSubscriptionOrdersSQSNodeFunction = new NodejsFunction(this, `KitchenSubscriptionOrdersSQSFoodFree${this.env_name}Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(60),
            handler: 'handler_orders_sqs_suscription',
            entry: join(
                __dirname,
                '..',
                '..',
                'src',
                'modules',
                'kitchen',
                'infrastructure',
                'subscriptions.ts',
            ),
            environment: {
                REGION: region
            },
        });

        this.storeNodeFunction = new NodejsFunction(this, `StoreFoodFree${this.env_name}Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            timeout: Duration.seconds(90),
            entry: join(
                __dirname,
                '..',
                '..',
                'src',
                'modules',
                'store',
                'infrastructure',
                'handler.ts',
            ),
            environment: {
                REGION: region,
                SNS_ARN: this.props.foodFreeIngredientsTopic.topicArn,
            },
        });

        this.storeSubscriptionIngredientsSQSNodeFunction = new NodejsFunction(this, `StoreSubscriptionIngredientsSQSFoodFree${this.env_name}Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(60),
            handler: 'handler_ingredients_sqs_suscription',
            entry: join(
                __dirname,
                '..',
                '..',
                'src',
                'modules',
                'store',
                'infrastructure',
                'subscriptions.ts',
            ),
            environment: {
                REGION: region
            },
        });
    }

    addRolePolicies(): void {
        this.ordersNodeFunction.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['sqs:SendMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
                // actions: ['*'],
                resources: [this.props.foodFreeOrdersQueue.queueArn],
            })
        )
        this.kitchenNodeFunction.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['sqs:SendMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
                // actions: ['*'],
                resources: [this.props.foodFreeIngredientsQueue.queueArn],
            })
        )
        this.storeNodeFunction.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['sns:Publish'],
                resources: [this.props.foodFreeIngredientsTopic.topicArn],
                // resources: ['*'],
            })
        )
    }

    makeIntegration(): void {
        this.ordersLambdaIntegration = new LambdaIntegration(this.ordersNodeFunction);
        this.kitchenLambdaIntegration = new LambdaIntegration(this.kitchenNodeFunction);
        this.storeLambdaIntegration = new LambdaIntegration(this.storeNodeFunction);
    }

    makeSubscriptions(): void {
        //
        // SNS subscriptions
        //
        this.props.foodFreeIngredientsTopic.addSubscription(new LambdaSubscription(this.kitchenSubscriptionSNSNodeFunction));

        //
        // SQS subscriptions
        //
        const eventSourceOrdersKitchen = new SqsEventSource(this.props.foodFreeOrdersQueue, {})
        this.kitchenSubscriptionOrdersSQSNodeFunction.addEventSource(eventSourceOrdersKitchen);
        const eventSourceIngredientsStore = new SqsEventSource(this.props.foodFreeIngredientsQueue, {})
        this.storeSubscriptionIngredientsSQSNodeFunction.addEventSource(eventSourceIngredientsStore);
    }
}