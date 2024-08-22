import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {addCors} from "../../shared/infrastructure/utils/cors";

//
// Factory method to create the handler
// Validate the request
//
async function handler(
    event: APIGatewayProxyEvent,
    context: Context,
): Promise<APIGatewayProxyResult> {
    context.callbackWaitsForEmptyEventLoop = false;

    let response: APIGatewayProxyResult;

    // SNS Publish example
    // const params = {
    //     Message: JSON.stringify({ some: 'payload' }),
    //     // it is easy to pass reference to the topic as environment variable using aws cdk
    //     TopicArn: process.env.SOME_TOPIC_ARN
    // };
    // await sns.publish(params).promise()

    try {
        switch (event.httpMethod) {
            case 'GET':
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'GET method',
                    }),
                }
                break;
            case 'POST':
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'POST method',
                    }),
                }
                break;
            case 'PUT':
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'PUT method',
                    }),
                }
                break;
            case 'PATCH':
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'PATCH method',
                    }),
                }
                break;
            case 'DELETE':
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'DELETE method',
                    }),
                }
                break;
            default:
                response = {
                    statusCode: 405,
                    body: JSON.stringify({
                        message: 'Method Not Allowed',
                    }),
                }
        }
    } catch (error) {
        console.error(error);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
            }),
        }
    }

    addCors(response);

    return response;
}

export {handler};
