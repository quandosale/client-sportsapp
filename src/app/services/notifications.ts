export class Notifications {
    sender: String;                          // Id of the account for the notification to be sent to
    sender_firstname: String;
    sender_lastname: String;
    sender_photo: String;
    receiver: String;                        // Id of the account of receiver
    message: String;                         // Message
    type: Number;                            // Notification Type     SHARE_REQUEST: 0,   DISALLOW_SHARE: 1,   ALLOW_SHARE: 2
}