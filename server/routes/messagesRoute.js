const { addMessage, getAllMessages } = require('../controllers/messagesController');

const router = require('express').Router();


router.post('/sendMsg', addMessage);
router.post('/getMessages', getAllMessages);



module.exports = router;