const express = require("express");
const router = express.Router();
const { getAllContacts, createContacts, updateContact, deleteContact } = require("../controllers/contact-controller");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.get('/', getAllContacts);
router.post('/create', createContacts);
router.route('/update/:id').put(updateContact);
router.delete('/delete/:id', deleteContact);

module.exports = router;