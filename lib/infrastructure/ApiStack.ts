import {Stack, StackProps} from "aws-cdk-lib";
import {Cors, LambdaIntegration, Resource, ResourceOptions, RestApi} from "aws-cdk-lib/aws-apigateway";
import {ApiStackModel} from "../model/ApiStackModel";
import {Construct} from "constructs";

interface ApiStackProps extends StackProps {
    ordersLambdaIntegration: LambdaIntegration;
    kitchenLambdaIntegration: LambdaIntegration;
    storeLambdaIntegration: LambdaIntegration;
    environment: { [key: string]: any }
}

export class ApiStack extends Stack implements ApiStackModel {
    //
    // Properties
    //
    private readonly env_name: string;
    private props: ApiStackProps;
    private api: RestApi;

    //
    // Resources
    //
    private ordersResource: Resource;
    private kitchenResource: Resource;
    private storeResource: Resource;

    //
    // CORS Options
    //
    private corsOptions: ResourceOptions = {
        defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
        },
    };

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);
        this.props = props;

        this.env_name = this.props.environment.name || '';
    }

    getApi(): RestApi {
        return this.api;
    }

    getOrdersResource(): Resource {
        return this.ordersResource;
    }

    getKitchenResource(): Resource {
        return this.kitchenResource;
    }

    getStoreResource(): Resource {
        return this.storeResource;
    }

    initialize(): void {
        this.api = new RestApi(this, `FoodFree${this.env_name}Api`, {
            restApiName: 'FoodFree Service ' + this.env_name,
            description: 'This service serve food-free. in ' + this.env_name,
        });

        this.ordersResource = this.api.root.addResource('orders', this.corsOptions);
        this.ordersResource.addMethod('GET', this.props?.ordersLambdaIntegration);
        this.ordersResource.addMethod('POST', this.props?.ordersLambdaIntegration);
        this.ordersResource.addMethod('PUT', this.props?.ordersLambdaIntegration);
        this.ordersResource.addMethod('PATCH', this.props?.ordersLambdaIntegration);
        this.ordersResource.addMethod('DELETE', this.props?.ordersLambdaIntegration);

        this.kitchenResource = this.api.root.addResource('kitchen', this.corsOptions);
        this.kitchenResource.addMethod('GET', this.props?.kitchenLambdaIntegration);
        this.kitchenResource.addMethod('POST', this.props?.kitchenLambdaIntegration);
        this.kitchenResource.addMethod('PUT', this.props?.kitchenLambdaIntegration);
        this.kitchenResource.addMethod('PATCH', this.props?.kitchenLambdaIntegration);
        this.kitchenResource.addMethod('DELETE', this.props?.kitchenLambdaIntegration);

        this.storeResource = this.api.root.addResource('store', this.corsOptions);
        this.storeResource.addMethod('GET', this.props?.storeLambdaIntegration);
        this.storeResource.addMethod('POST', this.props?.storeLambdaIntegration);
        this.storeResource.addMethod('PUT', this.props?.storeLambdaIntegration);
        this.storeResource.addMethod('PATCH', this.props?.storeLambdaIntegration);
        this.storeResource.addMethod('DELETE', this.props?.storeLambdaIntegration);
    }
}