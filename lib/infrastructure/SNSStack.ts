import {Stack, StackProps} from "aws-cdk-lib";
import {SNSStackModel} from "../model/SNSStackModel";
import {Construct} from "constructs";
import {Topic} from "aws-cdk-lib/aws-sns";

interface SNSStackProps extends StackProps {
    environment: { [key: string]: any }
}

export class SNSStack extends Stack implements SNSStackModel {
    private ingredientsTopic: Topic;
    private readonly env_name: string;

    constructor(scope: Construct, id: string, props: SNSStackProps) {
        super(scope, id, props);

        this.env_name = props.environment.name || '';
    }

    getIngredientsTopic(): Topic {
        return this.ingredientsTopic;
    }

    initialize(): void {
        this.ingredientsTopic = new Topic(this, `FoodFree${this.env_name}IngredientsTopic`, {
            displayName: 'FoodFree Ingredients Topic ' + this.env_name,
            topicName: 'food_free_ingredients_topic_' + this.env_name,
        });
    }

}