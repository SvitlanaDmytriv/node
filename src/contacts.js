const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

const readContent = async () => {
  try {
    const content = await fs.readFile(
      path.join(__dirname, 'db', 'contacts.json'),
      'utf8',
    )
    const result = JSON.parse(content)
    return result
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const listContacts = async () => {
  return await readContent()
}

const getContactById = async (contactId) => {
  try {
    const contacts = await readContent()
    const [contact] = contacts.filter((contact) => contact.id === contactId)
    return contact
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts()
    const contactWithoutRemoved = contacts.filter(
      (el) => el.id.toString() !== contactId,
    )
    await fs.writeFile(
      path.join(__dirname, 'db', 'contacts.json'),
      JSON.stringify(contactWithoutRemoved),
    )
    return await listContacts()
  } catch (error) {
    console.warn(error)
    process.exit(1)
  }
}

const addContact = async (name, email, phone) => {
  try {
    const contacts = await readContent()
    const newContact = { name, email, phone, id: crypto.randomUUID() }
    contacts.push(newContact)
    await fs.writeFile(
      path.join(__dirname, 'db', 'contacts.json'),
      JSON.stringify(contacts, null, 2),
    )
    return contacts
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact }
