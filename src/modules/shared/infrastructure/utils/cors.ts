import {APIGatewayProxyResult} from 'aws-lambda';

export function addCors(arg: APIGatewayProxyResult): void {
    if (!arg.headers) {
        arg.headers = {};
    }
    arg.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    };
}