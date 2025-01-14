// controllers/contact.js

const Contact = require("../models/contact");
const { contactSchema, favoriteSchema } = require("../schemas/contacts");

async function getContacts(req, res, next) {
  const owner = req.user.id;
  console.log({ user: req.user });
  try {
    const contacts = await Contact.find({ owner }).exec();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
}

async function getContact(req, res, next) {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id).exec();

    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact === null) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.send(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const owner = req.user.id;

    const validation = contactSchema.validate(req.body, req.user.id, {
      abortEarly: false,
    });

    if (validation.error) {
      const errorMessage = validation.error.details
        .map((error) => error.message)
        .join(", ");
      return res
        .status(400)
        .json({ message: `Validation Error: ${errorMessage}` });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      owner,
    });
    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const validation = contactSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const errorMessage = validation.error.details
        .map((error) => error.message)
        .join(", ");
      return res
        .status(400)
        .json({ message: `Validation Error: ${errorMessage}` });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updateContact = await Contact.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
      },
      { new: true }
    );

    if (!updateContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const favoriteValidation = favoriteSchema.validate(
      { favorite },
      { abortEarly: false }
    );
    if (favoriteValidation.error) {
      const errorMessage = favoriteValidation.error.details
        .map((error) => error.message)
        .join(", ");
      return res
        .status(400)
        .json({ message: `Validation Error: ${errorMessage}` });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        favorite,
      },
      { new: true }
    );

    if (updatedContact === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
