//require the comments model
const Message = require("../../../models/Message");
const WebSocket = require('ws');

const index = async (req, res) => {
    let messages;
        try{
            messages = await Message.find({ removed: false }).sort({ timestamp: -1 });
            res.json({
                status: "success",
                comment: "GETTING messages",
                data: [{
                    comments: messages,
                }],
            });
        }
        catch(err){
            console.error(err);
            res.json({
                status: "error",
                comment: "An error occurred while getting the messages.",
            });
        }
    
};
const create = async(req, res) => {
    let m = new Message();
    m.text = req.body.text;
    m.username = req.body.username;
    try {
        let doc = await m.save();

        // Send the new message to all connected WebSocket clients
        if (global.wss) {
            global.wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(doc));
                }
            });
        }

        res.json({
            "status": "success",
            "comment": "message sent",
            "data": {
                "comment": doc
            }
        });
    } catch (err) {
        console.error(err);
        res.json({
            "status": "error",
            "comment": "Could not save message"
        });
    }
};
const update = async (req, res) => {
    try {
        let message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (message) {
            // Send the updated message to all connected WebSocket clients
            if (global.wss) {
                global.wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(message));
                    }
                });
            }

            res.json({
                "status": "success",
                "comment": "UPDATED message with ID " + req.params.id,
                "data": {
                    "comment": message
                }
            });
        } else {
            res.json({
                "status": "error",
                "comment": "Message with ID " + req.params.id + " not found."
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            "status": "error",
            "comment": "An error occurred while updating the message."
        });
    }
};
// const destroy = async (req, res) => {
//     try {
//         let comment = await Comment.findByIdAndDelete(req.params.id);
//         console.log(comment);
//         if (comment) {
//             res.json({
//                 "status": "success",
//                 "comment": "DELETED comment with ID " + req.params.id
//             });
//         } else {
//             res.json({
//                 "status": "error",
//                 "comment": "Comment with ID " + req.params.id + " not found."
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.json({
//             "status": "error",
//             "comment": "An error occurred while deleting the comment."
//         });
//     }
// };


module.exports.index = index;
module.exports.create = create;
module.exports.update = update;
// module.exports.destroy = destroy;