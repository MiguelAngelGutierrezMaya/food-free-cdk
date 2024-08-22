import {APIGatewayProxyResult, SNSEvent, SNSEventRecord, SQSEvent, SQSRecord} from "aws-lambda";
import {addCors} from "../../shared/infrastructure/utils/cors";

async function handler_ingredients_sns_suscription(event: SNSEvent): Promise<APIGatewayProxyResult> {
    const records = event.Records.map((record: SNSEventRecord) => {
        const {Message, Subject, Type} = record.Sns;

        return {subject: Subject, message: Message, type: Type};
    });

    console.log('records: 👉', JSON.stringify(records, null, 2));

    const response: APIGatewayProxyResult = {
        body: JSON.stringify({records}),
        statusCode: 200,
    }

    addCors(response);

    return response;
}

async function handler_orders_sqs_suscription(event: SQSEvent): Promise<APIGatewayProxyResult> {
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

export {handler_ingredients_sns_suscription, handler_orders_sqs_suscription};