const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const CONSTANTS = require("../constants");

const getAllContacts = asyncHandler(async (req, res) => {
    const contactList = await Contact.find({ user_id: req.user.id });
    res.status(200).json({ contactList })
})
const createContacts = asyncHandler(async (req, res) => {
    const { name, phone_number, email } = req.body;
    if (!name || !phone_number || !email) {
        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("All Fields are mandatory")
    }
    const contact = await Contact.create({ name, phone_number, email, user_id: req.user.id });
    const contactList = await Contact.find({ user_id: req.user.id });
    res.status(201).json({ contactList })
})

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("Contact not found")
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(CONSTANTS.FORBIDDEN);
        throw new Error("You don't have the permission to update the contact")
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const contactList = await Contact.find({ user_id: req.user.id });
    res.status(201).json({ contactList })
})

const deleteContact = asyncHandler(async (req, res) => {
     try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(CONSTANTS.VALIDATION_FAILED);
            throw new Error("Contact not found")
        }
        if (contact.user_id.toString() !== req.user.id) {
            res.status(CONSTANTS.FORBIDDEN);
            throw new Error("You don't have the permission to update the contact")
        }
        const deletedContact = await Contact.findOneAndDelete({ _id: req.params.id }); // conatins only deleted profile
        const contactList = await Contact.find({ user_id: req.user.id }); // get all profile
        res.status(201).json({ contactList })
    } catch (error) {
        res.status(CONSTANTS.VALIDATION_FAILED);
        throw new Error("Contact not found")
    }

})


module.exports = { getAllContacts, createContacts, updateContact, deleteContact } 