const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // SocketIO
  _io.once('connection', (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      // Lưu vào daatabase 
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: data.images
      })
      await chat.save();

      // Return data to client
      _io.emit("SERVER_RETURN_MESSAGE",{
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: data.images
      })
  })
});
// End SocketIO  
  
    const chats = await Chat.find({
         deleted: false
    });

    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.infoUser = infoUser;
    }
    // console.log(chats);
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    });
};