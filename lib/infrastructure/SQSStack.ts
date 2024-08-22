import {Duration, Stack, StackProps} from "aws-cdk-lib";
import {SQSStackModel} from "../model/SQSStackModel";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Construct} from "constructs";

interface SQSStackProps extends StackProps {
    environment: { [key: string]: any }
}

export class SQSStack extends Stack implements SQSStackModel {
    private ordersQueue: Queue;
    private ingredientsQueue: Queue;
    private readonly env_name: string;

    constructor(scope: Construct, id: string, props: SQSStackProps) {
        super(scope, id, props);

        this.env_name = props.environment.name || '';
    }

    getOrdersQueue(): Queue {
        return this.ordersQueue;
    }

    getIngredientsQueue(): Queue {
        return this.ingredientsQueue;
    }

    initialize(): void {
        this.ordersQueue = new Queue(this, `FoodFree${this.env_name}OrdersQueue`, {
            queueName: 'food_free_orders_queue_' + this.env_name,
            visibilityTimeout: Duration.minutes(5),
        });

        this.ingredientsQueue = new Queue(this, 'FoodFreeIngredientsQueue', {
            queueName: 'food_free_ingredients_queue_' + this.env_name,
            visibilityTimeout: Duration.minutes(5),
        });
    }

}