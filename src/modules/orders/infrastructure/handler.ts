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

    // var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    //
    // var params = {
    //     DelaySeconds: 2,
    //
    //     MessageBody: JSON.stringify(event),
    //     QueueUrl: QUEUE_URL
    // };
    //
    // sqs.sendMessage(params, function (err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     } else {
    //         console.log("Success", data.MessageId);
    //     }
    // });

    try {
        switch (event.httpMethod) {
            case 'GET':
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'GET method hello juan',
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