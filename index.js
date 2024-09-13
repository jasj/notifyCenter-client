const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'notification_service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition).notificationservice;

const convertToStruct = (obj) => {
    const fields = {};
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            fields[key] = {
                listValue: {
                    values: value.map(item => ({
                        structValue: { fields: convertToStruct(item) }
                    }))
                }
            };
        } else if (typeof value === 'object' && value !== null) {
            fields[key] = { structValue: { fields: convertToStruct(value) } };
        } else if (typeof value === 'number') {
            fields[key] = { numberValue: value };
        } else {
            fields[key] = { stringValue: String(value) };
        }
    }
    return fields;
}

const sendNotification = (notifications) => {
    const client = new notificationProto.NotificationService('localhost:50051', grpc.credentials.createInsecure());
    const structNotifications = notifications.map(notification => ({
        ...notification,
        payload: { fields: convertToStruct(notification.payload) }
    }));

    client.SendNotifications({ notifications: structNotifications }, (error, response) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Response:', response);
        }
    });
}

module.exports = sendNotification
