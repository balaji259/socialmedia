const admin = require('./firebaseAdmin');
const User=require("./models/users")
const Notification=require('./models/notification')
const serviceAccount = require('./serviceAccountKey.json'); 

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
  


const sendNotification = async (userId, title, body) => {
  

  console.log("send notictaions!");
    console.log(userId);
    console.log(title);
    console.log(body);



    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      console.error('🚨 User not found or no FCM token available');
      return;
    }

  
  
  
    const message = {
    notification: {
      title,
      body,
    },
    token:user.fcmToken, // The recipient's device token
  };

  // const notification = new Notification({ userId, title, body });
  // await notification.save();
  // console.log("Notification saved in schema")
  

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = { sendNotification };
