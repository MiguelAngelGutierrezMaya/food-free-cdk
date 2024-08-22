import {APIGatewayProxyResult, SQSEvent, SQSRecord} from "aws-lambda";
import {addCors} from "../../shared/infrastructure/utils/cors";

async function handler_ingredients_sqs_suscription(event: SQSEvent): Promise<APIGatewayProxyResult> {
    const records = event.Records.map((record: SQSRecord) => {
        const {body, messageAttributes} = record;

        return {body, messageAttributes};
    });

    console.log('event: 👉', JSON.stringify(records, null, 2));

    const response: APIGatewayProxyResult = {
        body: JSON.stringify({records}),
        statusCode: 200,
    }

    addCors(response);

    return response;
}

export {handler_ingredients_sqs_suscription};